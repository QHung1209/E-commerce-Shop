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
  }), ConfigModule.forRoot({ isGlobal: true }), UsersModule, AuthModule, ProductsModule, InventoriesModule, DiscountsModule],
  controllers: [AppController, ProductsController, InventoriesController],
  providers: [AppService, AuthService, JwtService, {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },],
})
export class AppModule { }
