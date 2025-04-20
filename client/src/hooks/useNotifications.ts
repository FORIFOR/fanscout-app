import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Notification } from '@/types';

type NotificationEvent = {
  type: string;
  notification: Notification;
};

export function useNotifications(userId: number | null) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const socket = useRef<WebSocket | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Query for initial notifications
  const { data, isLoading } = useQuery<Notification[]>({
    queryKey: ['/api/notifications', { userId }],
    enabled: !!userId,
  });

  // Effect to set initial notifications
  useEffect(() => {
    if (data) {
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    }
  }, [data]);

  // Connect to WebSocket
  useEffect(() => {
    if (!userId) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const ws = new WebSocket(wsUrl);
    socket.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setError(null);
      
      // Subscribe to notifications for this user
      ws.send(JSON.stringify({
        type: 'subscribe',
        userId
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as NotificationEvent;
        
        if (data.type === 'notification' && data.notification) {
          // Add the new notification to state
          setNotifications(prev => [data.notification, ...prev]);
          
          // Update unread count
          if (!data.notification.read) {
            setUnreadCount(prev => prev + 1);
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (event) => {
      console.error('WebSocket error:', event);
      setError('Connection error. Reconnecting...');
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [userId]);

  // Mark notification as read
  const markAsRead = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('POST', `/api/notifications/${id}/read`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      // Decrease unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    },
  });

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    const unreadNotifications = notifications.filter(n => !n.read);
    
    if (unreadNotifications.length === 0) return;
    
    try {
      await Promise.all(
        unreadNotifications.map(notification => 
          markAsRead.mutateAsync(notification.id)
        )
      );
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, [notifications, markAsRead]);

  return {
    notifications,
    unreadCount,
    isLoading,
    isConnected,
    error,
    markAsRead: markAsRead.mutate,
    markAllAsRead,
  };
}