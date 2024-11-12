import { forwardRef, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisModule } from '@nestjs-modules/ioredis';
import { InventoriesModule } from 'src/inventories/inventories.module';

@Module({
  imports: [
    RedisModule.forRoot({
      options: {
        host: 'localhost',
        port: 6379,
      },
      type: 'single'
    }),
    forwardRef(() => InventoriesModule)
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class CustomRedisModule { }
