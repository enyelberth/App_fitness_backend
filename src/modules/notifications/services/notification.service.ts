import { Injectable } from '@nestjs/common';

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: Date;
}

@Injectable()
export class NotificationService {
  private notifications: Map<string, Notification[]> = new Map();

  createNotification(
    userId: string,
    type: string,
    title: string,
    message: string,
    data?: any,
  ): Notification {
    const notification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      type,
      title,
      message,
      data,
      read: false,
      createdAt: new Date(),
    };

    if (!this.notifications.has(userId)) {
      this.notifications.set(userId, []);
    }
    this.notifications.get(userId)!.push(notification);

    return notification;
  }

  getNotifications(userId: string, unreadOnly: boolean = false): Notification[] {
    const userNotifications = this.notifications.get(userId) || [];

    if (unreadOnly) {
      return userNotifications.filter(n => !n.read).sort((a, b) =>
        b.createdAt.getTime() - a.createdAt.getTime(),
      );
    }

    return userNotifications.sort((a, b) =>
      b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  markAsRead(userId: string, notificationId: string): void {
    const userNotifications = this.notifications.get(userId) || [];
    const notification = userNotifications.find(n => n.id === notificationId);

    if (notification) {
      notification.read = true;
    }
  }

  markAllAsRead(userId: string): void {
    const userNotifications = this.notifications.get(userId) || [];
    userNotifications.forEach(n => (n.read = true));
  }

  deleteNotification(userId: string, notificationId: string): void {
    const userNotifications = this.notifications.get(userId) || [];
    const index = userNotifications.findIndex(n => n.id === notificationId);

    if (index > -1) {
      userNotifications.splice(index, 1);
    }
  }

  getUnreadCount(userId: string): number {
    const userNotifications = this.notifications.get(userId) || [];
    return userNotifications.filter(n => !n.read).length;
  }

  // Notificación de logro
  notifyAchievement(userId: string, achievement: string) {
    this.createNotification(
      userId,
      'ACHIEVEMENT',
      '🏆 Logro Desbloqueado',
      `¡Felicidades! Desbloqueaste: ${achievement}`,
      { achievement },
    );
  }

  // Notificación de nivel subido
  notifyLevelUp(userId: string, level: number) {
    this.createNotification(
      userId,
      'LEVEL_UP',
      '⬆️ Subiste de Nivel',
      `¡Felicidades! Ahora eres nivel ${level}`,
      { level },
    );
  }

  // Notificación de recompensa
  notifyReward(userId: string, reward: string, amount: number) {
    this.createNotification(
      userId,
      'REWARD',
      '🎁 Recompensa Obtenida',
      `Recibiste ${amount} ${reward}`,
      { reward, amount },
    );
  }

  // Notificación de quest completada
  notifyQuestCompleted(userId: string, questName: string) {
    this.createNotification(
      userId,
      'QUEST',
      '✅ Quest Completada',
      `Completaste: ${questName}`,
      { questName },
    );
  }
}
