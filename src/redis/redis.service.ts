import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { join } from 'path/win32';
import { InventoriesService } from 'src/inventories/inventories.service';



@Injectable()
export class RedisService {
    private readonly CACHE_TTL = 1800
    constructor(@InjectRedis() private readonly redisClient: Redis,
        private configService: ConfigService,
        private inventoryService: InventoriesService) { }
    async acquireLock(productId: string, quantity: number, cartId: string) {
        const key = `keyLock_${productId}`
        const retryTimes = this.configService.get<number>("RETRY_TIMES")
        const expiredTime = this.configService.get<number>("EXPIRED_TIME")
        const delayTime = this.configService.get<number>("DELAY_TIME")

        for (let retry = 0; retry < retryTimes; retry++) {
            const result = await this.redisClient.set(key, 'locked', 'PX', expiredTime, 'NX');
            console.log('pessimistic lock hihihi >>>>>', result, retry)
            if (result != null) {
                const isReservation = await this.inventoryService.reservationInventory(productId, quantity, cartId)

                // await new Promise(resolve => setTimeout(resolve, 500));

                if (isReservation.modifiedCount) {
                    await this.redisClient.expire(key, expiredTime)
                    return key
                }
                return null

            }
            else {
                await new Promise(resolve => setTimeout(resolve, delayTime));
            }
        }

    }

    async releaseLock(key: string): Promise<void> {
        await this.redisClient.del(key);
    }


    async jsonSet(key: string, json: any)
    {   try {
        return await this.redisClient.call('JSON.SET', key,'$', JSON.stringify(json))
        
    } catch (error) {
        throw error
    }
    }

    async jsonGet(key: string) {
        try {
          const result = await this.redisClient.call('JSON.GET', key, '$') as string | null;
          return result ? JSON.parse(result) : null;
        } catch (error) {
          throw error;
        }
      }
    async setPX(key: string, value: string, expiredTime: number) 
      {
          await this.redisClient.set(key, value, 'PX', expiredTime);
      }

      async setEX(key: string, value: string, expiredTime: number) 
      {
          await this.redisClient.set(key, value, 'EX', expiredTime);
      }
  
    async get(key: string) {
          return await this.redisClient.get(key);
      }

    hgetall(key: string) {
        return this.redisClient.hgetall(key);
    }

    hincrby(hash, key, incr) {
        return this.redisClient.hincrby(hash, key, incr);
    }

    del(key: string) {
        return this.redisClient.del(key);
    }
}
