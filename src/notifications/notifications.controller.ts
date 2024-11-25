import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  @Get()
  getListNoti(@Body("noti_type") noti_type: string, @Body("isRead") isRead: number, @Body("receiverId") receiverId: number) {
    return this.notificationsService.listNotiByUser(receiverId, noti_type, isRead)
  }

}
