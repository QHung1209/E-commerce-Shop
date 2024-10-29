import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { ProductsModule } from './products/products.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ProductsController } from './products/products.controller';

@Module({
  imports: [MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      uri: configService.get<string>('MONGO_URL'),
      connectionFactory: (connection) => {
        connection.plugin(softDeletePlugin);
        return connection;
      }
    }), inject: [ConfigService]
  }), ConfigModule.forRoot({ isGlobal: true }), UsersModule, AuthModule, ProductsModule],
  controllers: [AppController, ProductsController],
  providers: [AppService, AuthService, JwtService, {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },],
})
export class AppModule { }
