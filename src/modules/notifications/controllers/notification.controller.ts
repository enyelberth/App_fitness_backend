import { Controller, Get, Post, Delete, Param, Query, UseGuards, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationService } from '../services/notification.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/types';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  async getNotifications(
    @CurrentUser() user: AuthenticatedUser,
    @Query('unreadOnly') unreadOnly: boolean = false,
  ) {
    return this.notificationService.getNotifications(user.id, unreadOnly);
  }

  @Get('unread-count')
  async getUnreadCount(@CurrentUser() user: AuthenticatedUser) {
    return {
      unreadCount: this.notificationService.getUnreadCount(user.id),
    };
  }

  @Post(':notificationId/read')
  async markAsRead(
    @CurrentUser() user: AuthenticatedUser,
    @Param('notificationId') notificationId: string,
  ) {
    this.notificationService.markAsRead(user.id, notificationId);
    return { message: 'Notificación marcada como leída' };
  }

  @Post('read-all')
  async markAllAsRead(@CurrentUser() user: AuthenticatedUser) {
    this.notificationService.markAllAsRead(user.id);
    return { message: 'Todas las notificaciones marcadas como leídas' };
  }

  @Delete(':notificationId')
  async deleteNotification(
    @CurrentUser() user: AuthenticatedUser,
    @Param('notificationId') notificationId: string,
  ) {
    this.notificationService.deleteNotification(user.id, notificationId);
    return { message: 'Notificación eliminada' };
  }
}
