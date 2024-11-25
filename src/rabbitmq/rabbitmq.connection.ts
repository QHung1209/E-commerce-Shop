import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import amqp from "amqplib";
import asyncRetry from 'async-retry';

let connection: amqp.Connection = null;
let channel: amqp.Channel = null;

@Injectable()
export class RabbitmqConnection implements OnModuleInit {
    constructor(private readonly configService: ConfigService) { }
    async onModuleInit(): Promise<void> {
        await this.createConnection()
    }

    getUri(): string {
        return this.configService.get<string>('RABBIT_MQ_URI');
    }

    getQueue(queueName: string): string {
        return this.configService.get<string>(`RABBIT_MQ_${queueName}_QUEUE`);
    }
    async closeConnection(): Promise<void> {
        try {
            if (connection) {
                await connection.close();
                console.log('Connection Rabbitmq closed gracefully');
            }
        } catch (error) {
            console.log('Connection Rabbitmq close failed!');
        }
    }

    async createConnection() {
        if (!connection || !connection == undefined) {
            try {
                await asyncRetry(
                    async () => {
                        connection = await amqp.connect(this.getUri())
                    }, {
                    retries: 5,
                    factor: 2,
                    minTimeout: 1000,
                    maxTimeout: 10000
                })
                connection.on('error', async (error): Promise<void> => {
                    console.log(`Error occurred on connection: ${error}`);
                    await this.closeConnection();
                    await this.createConnection();
                });
            } catch (error) {
                throw new Error('Rabbitmq connection is failed!');
            }
        }
        return connection
    }


    async getChannel(): Promise<amqp.Channel> {
        try {
            if (!connection) {
                throw new Error('Rabbitmq connection is failed!');
            }

            if ((connection && !channel) || !channel) {
                await asyncRetry(
                    async () => {
                        channel = await connection.createChannel();
                        console.log('Channel Created successfully');
                    },
                    {
                        retries: 5,
                        factor: 2,
                        minTimeout: 1000,
                        maxTimeout: 10000
                    }
                );
            }

            channel.on('error', async (error): Promise<void> => {
                console.log(`Error occurred on channel: ${error}`);
                await this.closeChanel();
                await this.getChannel();
            });

            return channel;
        } catch (error) {
            console.error('Failed to get channel!');
        }
    }

    async closeChanel(): Promise<void> {
        try {
            if (channel) {
                await channel.close();
                console.log('Channel closed successfully');
            }
        } catch (error) {
            console.error('Channel close failed!');
        }
    }
}