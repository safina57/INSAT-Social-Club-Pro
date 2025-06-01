import { useEffect, useRef, useState, useCallback } from 'react';
import { Notification } from '@/components/common/notifications-panel';
import { eventsPatterns } from '@/constants/eventsPatterns';

interface SSEEvent {
  type: string;
  data: {
    id: string;
    userId: string;
    type: string;
    message: string;
    createdAt: string;
    [key: string]: any;
  };
}

interface UseSSENotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isConnected: boolean;
  error: string | null;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

// Map backend event types to frontend notification types
const mapEventTypeToNotificationType = (eventType: string): Notification['type'] => {
  switch (eventType) {
    case eventsPatterns.POST_LIKED:
      return 'like';
    case eventsPatterns.POST_COMMENTED:
      return 'comment';
    case eventsPatterns.POST_SHARED:
      return 'share';
    case eventsPatterns.FRIEND_REQUEST_SENT:
    case eventsPatterns.FRIEND_REQUEST_ACCEPTED:
      return 'connection';
    default:
      return 'message';
  }
};

// Transform SSE event to notification
const transformSSEEventToNotification = (event: SSEEvent): Notification => {
  const notificationType = mapEventTypeToNotificationType(event.type);
  
  return {
    id: event.data.id || `notification-${Date.now()}`,
    type: notificationType,
    user: {
      name: event.data.authorUsername || event.data.userName || event.data.senderName || 'Unknown User',
      avatar: event.data.userAvatar || event.data.senderAvatar || '/placeholder.svg?height=40&width=40',
    },
    content: event.data.message || getDefaultMessageForType(event.type),
    timestamp: event.data.createdAt || new Date().toISOString(),
    read: false,
    link: event.data.link || generateLinkForEvent(event),
  };
};

// Generate default messages for different event types
const getDefaultMessageForType = (eventType: string): string => {
  switch (eventType) {
    case eventsPatterns.POST_LIKED:
      return 'liked your post';
    case eventsPatterns.POST_COMMENTED:
      return 'commented on your post';
    case eventsPatterns.POST_SHARED:
      return 'shared your post';
    case eventsPatterns.FRIEND_REQUEST_SENT:
      return 'sent you a friend request';
    case eventsPatterns.FRIEND_REQUEST_ACCEPTED:
      return 'accepted your friend request';
    case eventsPatterns.APPLICATION_STATUS_CHANGED:
      return 'updated your application status';
    case eventsPatterns.NEW_JOB_APPLICATION:
      return 'applied to your job posting';
    default:
      return 'sent you a notification';
  }
};

// Generate appropriate links for events
const generateLinkForEvent = (event: SSEEvent): string => {
  switch (event.type) {
    case eventsPatterns.POST_LIKED:
    case eventsPatterns.POST_COMMENTED:
    case eventsPatterns.POST_SHARED:
      return `/post/${event.data.postId || ''}`;
    case eventsPatterns.FRIEND_REQUEST_SENT:
    case eventsPatterns.FRIEND_REQUEST_ACCEPTED:
      return `/profile/${event.data.senderId || ''}`;
    case eventsPatterns.APPLICATION_STATUS_CHANGED:
    case eventsPatterns.NEW_JOB_APPLICATION:
      return `/jobs/applications`;
    default:
      return '/notifications';
  }
};

// Custom fetch-based SSE connection that supports Authorization headers
class FetchEventSource {
  private controller: AbortController | null = null;
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  public onopen: (() => void) | null = null;
  public onmessage: ((event: { data: string; type?: string }) => void) | null = null;
  public onerror: ((error: any) => void) | null = null;
  private eventListeners: Map<string, (event: { data: string }) => void> = new Map();

  constructor(private url: string, private options: { headers?: Record<string, string> } = {}) {}

  async connect() {
    try {
      this.controller = new AbortController();
      
      const response = await fetch(this.url, {
        method: 'GET',
        headers: {
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache',
          ...this.options.headers,
        },
        signal: this.controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (this.onopen) {
        this.onopen();
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      this.reader = reader;
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          this.processLine(line);
        }
      }    } catch (error: any) {
      if (error instanceof Error && error.name !== 'AbortError' && this.onerror) {
        this.onerror(error);
      } else if (!(error instanceof Error) && this.onerror) {
        this.onerror(new Error(String(error)));
      }
    }
  }

  private processLine(line: string) {
    if (line.startsWith('data: ')) {
      const data = line.slice(6);
      
      try {
        const eventData = JSON.parse(data);
        const eventType = eventData.type || 'message';
        
        // Call specific event listener if exists
        const listener = this.eventListeners.get(eventType);
        if (listener) {
          listener({ data });
        }
        
        // Call generic message handler
        if (this.onmessage) {
          this.onmessage({ data, type: eventType });
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error);
        // Try to call onmessage with raw data
        if (this.onmessage) {
          this.onmessage({ data });
        }
      }
    }
  }

  addEventListener(eventType: string, listener: (event: { data: string }) => void) {
    this.eventListeners.set(eventType, listener);
  }

  close() {
    if (this.controller) {
      this.controller.abort();
    }
    if (this.reader) {
      this.reader.cancel();
    }
    this.eventListeners.clear();
  }
}

export const useSSENotifications = (): UseSSENotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<FetchEventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const unreadCount = notifications.filter(notification => !notification.read).length;

  // Initialize SSE connection
  const initializeConnection = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('No authentication token found');
      return;
    }

    try {
      // Close existing connection if any
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const fetchEventSource = new FetchEventSource(
        'http://localhost:3001/notification/events',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      eventSourceRef.current = fetchEventSource;

      fetchEventSource.onopen = () => {
        setIsConnected(true);
        setError(null);
        console.log('SSE connection established');
      };      fetchEventSource.onerror = (error: any) => {
        console.error('SSE connection error:', error);
        setIsConnected(false);
        const errorMessage = error instanceof Error ? error.message : String(error);
        setError('Connection error: ' + (errorMessage || 'Unknown error'));
        
        // Attempt to reconnect after 5 seconds
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect SSE...');
          initializeConnection();
        }, 5000);
      };      // Generic message handler for all events
      fetchEventSource.onmessage = (event) => {
        try {
          const eventData = JSON.parse(event.data);
          console.log('Received SSE event:', eventData); // Debug log
          const sseEvent: SSEEvent = {
            type: eventData.type || 'message',
            data: eventData,
          };
          
          const notification = transformSSEEventToNotification(sseEvent);
          addNotification(notification);
        } catch (error) {
          console.error('Error parsing SSE event:', error);
        }
      };

      // Start the connection
      await fetchEventSource.connect();    } catch (error: any) {
      console.error('Failed to initialize SSE connection:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setError('Failed to initialize connection: ' + (errorMessage || 'Unknown error'));
    }
  }, []);

  // Add notification
  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
  }, []);

  // Mark notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  // Clear single notification
  const clearNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Initialize connection on mount
  useEffect(() => {
    initializeConnection();

    // Cleanup on unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [initializeConnection]);

  // Reconnect when token changes
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token && !isConnected && !error) {
      initializeConnection();
    }
  }, [initializeConnection, isConnected, error]);

  return {
    notifications,
    unreadCount,
    isConnected,
    error,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
  };
};
