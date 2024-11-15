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
import { InventoriesModule } from './inventories/inventories.module';
import { InventoriesController } from './inventories/inventories.controller';
import { DiscountsModule } from './discounts/discounts.module';
import { CartsModule } from './carts/carts.module';
import { CheckoutsModule } from './checkouts/checkouts.module';
import { CustomRedisModule } from './redis/custom.redis.module';
import { OrdersModule } from './orders/orders.module';
import { CommentsModule } from './comments/comments.module';
import { CommentsController } from './comments/comments.controller';

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
  }), ConfigModule.forRoot({ isGlobal: true }), UsersModule, AuthModule, ProductsModule, InventoriesModule, DiscountsModule, CartsModule, CheckoutsModule, CustomRedisModule, OrdersModule, CommentsModule],
  controllers: [AppController, ProductsController, InventoriesController, CommentsController],
  providers: [AppService, AuthService, JwtService, {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },],
})
export class AppModule { }
