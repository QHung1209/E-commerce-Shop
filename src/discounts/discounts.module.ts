import { Module } from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { DiscountsController } from './discounts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Discount, DiscountSchema } from './schema/discount.schema';
import { Product, ProductSchema } from 'src/products/schemas/product.schemas';
import { ProductsService } from 'src/products/products.service';
import { Inventory, InventorySchema } from 'src/inventories/schemas/inventory.schema';
import { InventoriesService } from 'src/inventories/inventories.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Discount.name, schema: DiscountSchema }, { name: Product.name, schema: ProductSchema }, { name: Inventory.name, schema: InventorySchema }])],
  controllers: [DiscountsController],
  providers: [DiscountsService, ProductsService, InventoriesService],
  exports: [DiscountsService]
})
export class DiscountsModule { }
