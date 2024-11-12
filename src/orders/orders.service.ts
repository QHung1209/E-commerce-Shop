import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/user.interface';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: SoftDeleteModel<OrderDocument>) { }

  async createOrder(userId: string, checkout: object, address: string, payment_type: string, products: Array<object>) {
    return await this.orderModel.create({
      userId,
      checkout,
      address,
      payment_type,
      products
    })
  }

  async getOrdersByUser(user: IUser) {
    return await this.orderModel.find({ userId: user._id })
  }

  async getOrderById(orderId: string) {
    const order = await this.orderModel.findById(orderId)
    if (order)
      throw new NotFoundException("Not found order")
    return order
  }

  async updateOrderStatus(updateOrderDto: UpdateOrderDto, user: IUser) {
    const order = await this.orderModel.findByIdAndUpdate(updateOrderDto.orderId,
      {
        status: updateOrderDto.status,
        updatedBy: {
          _id: user._id,
          email: user.email
        },
        updatedAt: new Date()
      }, { new: true }
    )
    return order
  }
}
