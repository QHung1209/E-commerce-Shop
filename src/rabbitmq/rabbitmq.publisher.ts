import { v4 } from "uuid";
import { RabbitmqConnection } from "./rabbitmq.connection";
import asyncRetry from 'async-retry';
import { Injectable } from "@nestjs/common";
import { getTypeName } from "src/utils/reflection";
import { serializeObject } from "src/utils/serialization";

const publishedMessages: string[] = [];
@Injectable()
export class RabbitmqPublisher {
    constructor(private readonly rabbitMQConnection: RabbitmqConnection) { }

    async publishMessage<T>(message: T): Promise<void> {
        try {
            await asyncRetry(
                async () => {
                    const channel = await this.rabbitMQConnection.getChannel()
                    const exchangeName = getTypeName(message)
                    const serializedMessage = serializeObject(message);

                    await channel.assertExchange(exchangeName, 'fanout', {
                        durable: false
                    })

                    const messageProperties = {
                        messageId: v4().toString(),
                        timestamp: new Date(),
                        contentType: 'application/json',
                        exchange: exchangeName,
                        type: 'fanout'
                    }

                    channel.publish(exchangeName, '', Buffer.from(serializedMessage), {
                        headers: messageProperties
                    })

                    console.log(`Message: ${serializedMessage} sent with exchange name ${exchangeName}`)

                    publishedMessages.push(exchangeName)
                }, {
                retries: 5,
                factor: 2,
                maxTimeout: 1000,
                maxRetryTime: 10000
            }
            )
        } catch (error) {
            console.error('khong thay', error)
            await this.rabbitMQConnection.closeChanel();
        }
    }
    async isPublished(message: string): Promise<boolean> {
        const exchangeName = getTypeName(message)
        const isPublished = publishedMessages.includes(exchangeName)
        return Promise.resolve(isPublished)
    }
}