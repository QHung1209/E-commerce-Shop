import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { InventoriesService } from 'src/inventories/inventories.service';


@Injectable()
export class RedisService {
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
            if (result) {
                const isReservation = await this.inventoryService.reservationInventory(productId, quantity, cartId)
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


    async set(key: string, value: string, expiredTime: number) {
        await this.redisClient.set(key, value, 'PX', expiredTime);
    }

    async get(key: string) {
        return await this.redisClient.get(key);
    }
}
