import { DynamicModule, Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { RabbitmqConnection } from './rabbitmq.connection';
import { RabbitmqConsumer } from './rabbitmq.subscriber';
import { RabbitmqPublisher } from './rabbitmq.publisher';
interface RmqModuleOptions {
    name: string
}
@Module({
    providers: [
        RabbitMQService,
        RabbitmqConnection,
        RabbitmqConsumer,
        RabbitmqPublisher
    ],
    exports: [RabbitMQService, RabbitmqConnection, RabbitmqConsumer, RabbitmqPublisher]
})
export class RabbitMQModule {
    static register({ name }: RmqModuleOptions): DynamicModule {
        return {
            module: RabbitMQModule,
            imports: [
                ClientsModule.registerAsync([{
                    name,
                    useFactory: (configService: ConfigService) => ({
                        transport: Transport.RMQ,
                        options: {
                            urls: [configService.get<string>('RABBIT_MQ_URI')],
                            queue: configService.get<string>(`RABBIT_MQ_${name}_QUEUE`)
                        }
                    }),
                    inject: [ConfigService]
                }])
            ],
            exports: [ClientsModule]
        }
    }
}
