import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';
import { IUser } from 'src/users/user.interface';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RabbitmqPublisher } from 'src/rabbitmq/rabbitmq.publisher';

@Injectable()
export class NotificationsService {
  constructor(@InjectModel(Notification.name) private notificationModel: SoftDeleteModel<NotificationDocument>,
    @Inject("NOTIFICATION") private readonly rabbitMQClient: ClientProxy,
    private readonly rabbitMQPublisher: RabbitmqPublisher) { }

  async pushNotification(noti_type: string, receiverId: number, senderId: string, content: string, user: IUser) {
    const noti = await this.notificationModel.create({
      senderId, receiverId, content, noti_type, createdBy: {
        _id: user._id,
        email: user.name
      }
    })
    await this.rabbitMQPublisher.publishMessage(noti)
    return noti;
  }

  async listNotiByUser(userId: number, noti_type: string, isRead: number) {
    const match = { receiverId: userId }
    return await this.notificationModel.aggregate([{
      $match: match
    }, {
      $project: {
        noti_type: 1,
        senderId: 1,
        receiverId: 1,
        content: 1,
        createAt: 1
      }
    }
    ])
  }
}
