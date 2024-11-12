import { Module } from '@nestjs/common';
import { CheckoutsService } from './checkouts.service';
import { CheckoutsController } from './checkouts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Checkout, CheckoutSchema } from './schemas/checkout.schema';
import { CartsModule } from 'src/carts/carts.module';
import { ProductsModule } from '../products/products.module';
import { DiscountsModule } from 'src/discounts/discounts.module';
import { CustomRedisModule } from 'src/redis/custom.redis.module';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Checkout.name, schema: CheckoutSchema }]), CartsModule, DiscountsModule, ProductsModule, CustomRedisModule, OrdersModule],
  controllers: [CheckoutsController],
  providers: [CheckoutsService],
})
export class CheckoutsModule { }
