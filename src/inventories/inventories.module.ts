import { forwardRef, Module } from '@nestjs/common';
import { InventoriesService } from './inventories.service';
import { InventoriesController } from './inventories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Inventory, InventorySchema } from './schemas/inventory.schema';
import { CustomRedisModule } from 'src/redis/custom.redis.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Inventory.name, schema: InventorySchema }]),
  forwardRef(() => CustomRedisModule)],
  controllers: [InventoriesController],
  providers: [InventoriesService],
  exports: [InventoriesService],

})
export class InventoriesModule { }
