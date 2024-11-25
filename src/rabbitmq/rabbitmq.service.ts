import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, ClientProxyFactory, RmqOptions, Transport } from '@nestjs/microservices';
import amqp from 'amqp-connection-manager';

@Injectable()
export class RabbitMQService {
    constructor(private readonly configService: ConfigService,
    ) { }
    getUri(): string {
        return this.configService.get<string>('RABBIT_MQ_URI');
    }

    getQueue(queueName: string): string {
        return this.configService.get<string>(`RABBIT_MQ_${queueName}_QUEUE`);
    }

    getOptions(queue: string, noAck = false): RmqOptions {
        return {
            transport: Transport.RMQ,
            options: {
                urls: [this.getUri()],
                queue: this.getQueue(queue),
                noAck,
                persistent: true
            }
        }
    }

}
