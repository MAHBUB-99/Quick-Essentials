import { useState } from 'react';
import type { IconName } from '@/lib/icons';

export interface StoreNotification {
  id: string;
  message: string;
  icon: NotificationIcon;
  enabled: boolean;
}

export type NotificationIcon = Extract<IconName, 'truck' | 'bolt' | 'leaf' | 'shield' | 'info'>;

const STORAGE_KEY = 'quickessentials-notifications-v1';

export const DEFAULT_NOTIFICATIONS: StoreNotification[] = [
  { id: 'delivery', message: 'Free delivery on orders over ৳1,000', icon: 'truck', enabled: true },
  { id: 'welcome', message: '10% off your first order', icon: 'bolt', enabled: true },
  { id: 'fresh', message: 'Fresh arrivals every morning', icon: 'leaf', enabled: true },
  { id: 'secure', message: 'Secure and reliable ordering', icon: 'shield', enabled: true },
];

export function readNotifications(): StoreNotification[] {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return DEFAULT_NOTIFICATIONS;
  try {
    const notifications = JSON.parse(saved) as StoreNotification[];
    return Array.isArray(notifications) ? notifications : DEFAULT_NOTIFICATIONS;
  } catch {
    return DEFAULT_NOTIFICATIONS;
  }
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<StoreNotification[]>(readNotifications);

  const save = (next: StoreNotification[]) => {
    setNotifications(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const addNotification = (message: string, icon: NotificationIcon) => {
    save([...notifications, { id: crypto.randomUUID(), message: message.trim(), icon, enabled: true }]);
  };

  const updateNotification = (id: string, changes: Partial<Omit<StoreNotification, 'id'>>) => {
    save(notifications.map((item) => (item.id === id ? { ...item, ...changes } : item)));
  };

  const deleteNotification = (id: string) => {
    save(notifications.filter((item) => item.id !== id));
  };

  return { notifications, addNotification, updateNotification, deleteNotification };
}
