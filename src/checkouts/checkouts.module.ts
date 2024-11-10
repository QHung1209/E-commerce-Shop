import { Module } from '@nestjs/common';
import { CheckoutsService } from './checkouts.service';
import { CheckoutsController } from './checkouts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Checkout, CheckoutSchema } from './schemas/checkout.schema';
import { CartsModule } from 'src/carts/carts.module';
import { ProductsModule } from '../products/products.module';
import { DiscountsService } from 'src/discounts/discounts.service';
import { DiscountsModule } from 'src/discounts/discounts.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Checkout.name, schema: CheckoutSchema }]), CartsModule, DiscountsModule, ProductsModule],
  controllers: [CheckoutsController],
  providers: [CheckoutsService],
})
export class CheckoutsModule { }
