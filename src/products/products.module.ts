import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schemas';
import { InventoriesService } from 'src/inventories/inventories.service';
import { Inventory, InventorySchema } from 'src/inventories/schemas/inventory.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }, {
    name: Inventory.name, schema: InventorySchema
  }])],
  controllers: [ProductsController],
  providers: [ProductsService, InventoriesService],
  exports: [ProductsService],
})
export class ProductsModule { }
