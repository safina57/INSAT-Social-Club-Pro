import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  id: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}m ago`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  } else {
    return date.toLocaleDateString();
  }
};

// TODO: must be replaced with an API call to get the current user
export const getCurrentUser = (): { id: string; role: string } | null => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      return null;
    }

    const decoded = jwtDecode<JwtPayload>(token);
    return {
      id: decoded.id,
      role: decoded.role,
    };
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
};
