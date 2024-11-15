import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from 'src/decorators/user.decorator';
import { IUser } from 'src/users/user.interface';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Get()
  getOrders(@User() user: IUser) {
    return this.ordersService.getOrdersByUser(user)
  }

  @Get(":id")
  getOrdersById(@Body("orderId") orderId: string) {
    return this.ordersService.getOrderById(orderId)
  }

  @Post()
  updateOrder(@Body() updateOrderDto: UpdateOrderDto, @User() user: IUser) {
    return this.ordersService.updateOrderStatus(updateOrderDto, user)
  }
}
