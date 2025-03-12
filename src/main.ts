import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { TransformInterceptor } from './core/transform.interceptor'
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { RabbitMQService } from './rabbitmq/rabbitmq.service';
import { PoliciesGuard } from './auth/policies.guard';
import { RedisService } from './redis/redis.service';
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector)
  const redisService = app.get(RedisService);
  app.useGlobalGuards(new JwtAuthGuard(reflector,redisService))
  // app.useGlobalGuards(new RolesGuard(reflector))
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalInterceptors(new TransformInterceptor(reflector))

  app.use(cookieParser())

  app.enableCors({
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    credentials: true
  })
  // const rmqService = app.get<RabbitMQService>(RabbitMQService)
  const configService = app.get(ConfigService)
  // app.connectMicroservice(rmqService.getOptions('NOTIFICATION'))
  await app.listen(process.env.PORT);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
