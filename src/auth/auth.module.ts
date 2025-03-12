import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './passport/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './passport/jwt.strategy';
import { CustomRedisModule } from 'src/redis/custom.redis.module';
const ms = require('ms')
@Module({
  imports: [UsersModule, PassportModule,CustomRedisModule, JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_ACCESS_TOKEN'),
      signOptions: { expiresIn: ms(configService.get<string>('JWT_ACCESS_EXPIRE')) / 1000, }
    }),
    inject: [ConfigService],
  }),],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule { }
