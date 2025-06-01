import React, { createContext, useContext, ReactNode } from 'react';
import { useSSENotifications } from '@/hooks/useSSENotifications';
import { Notification } from '@/components/common/notifications-panel';

interface NotificationsContextType {
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

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

interface NotificationsProviderProps {
  children: ReactNode;
}

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({ children }) => {
  const notificationsData = useSSENotifications();

  return (
    <NotificationsContext.Provider value={notificationsData}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = (): NotificationsContextType => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
