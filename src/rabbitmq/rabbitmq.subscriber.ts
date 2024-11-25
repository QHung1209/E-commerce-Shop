import { Injectable } from "@nestjs/common";
import { RabbitmqConnection } from "./rabbitmq.connection";
import asyncRetry from 'async-retry';
import { getTypeName } from '../utils/reflection';

const consumedMessages: string[] = []

@Injectable()
export class RabbitmqConsumer {
    constructor(private readonly rabbitMQConnection: RabbitmqConnection) { }

    async consumeMessage<T>(type: T): Promise<void> {
        try {
            await asyncRetry(
                async () => {
                    const channel = await this.rabbitMQConnection.getChannel()
                    const exchangeName = getTypeName(type)

                    await channel.assertExchange(exchangeName, 'fanout', {
                        durable: false
                    })
                    const q = await channel.assertQueue('', { exclusive: true })

                    await channel.bindQueue(q.queue, exchangeName, '')

                    console.log(`Waiting for message with exchange name ${exchangeName}`)

                    await channel.consume(q.queue, (message) => {
                        if (message !== null) {
                            const messageContent = message?.content?.toString()
                            const headers = message.properties.headers || {}

                            console.log(`Message: ${messageContent} deliverd to queue ${q.queue} with exchange name: ${exchangeName}`)
                            channel.ack(message)
                            consumedMessages.push(exchangeName)
                        }
                    }, { noAck: false })
                }, {
                retries: 5,
                factor: 2,
                minTimeout: 1000,
                maxTimeout: 10000
            }
            )
        } catch (error) {
            console.error(error)
            await this.rabbitMQConnection.closeChanel()
        }
    }

    async isConsumed(message: string): Promise<boolean> {
        const timeoutTime = 30000; // 30 seconds in milliseconds
        const startTime = Date.now();
        let timeOutExpired = false;
        let isConsumed = false;

        while (true) {
            if (timeOutExpired) {
                return false;
            }
            if (isConsumed) {
                return true;
            }

            const exchangeName = getTypeName(message)

            isConsumed = consumedMessages.includes(exchangeName);

            timeOutExpired = Date.now() - startTime > timeoutTime;
        }
    }
}
