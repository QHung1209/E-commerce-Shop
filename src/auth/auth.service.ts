import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
const ms = require('ms');
import { Response } from 'express';
import { User } from 'src/users/schemas/user.schema';
import { IUser } from 'src/users/user.interface';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService, private jwtService: JwtService,
    private redisService: RedisService,
    private configService: ConfigService) { }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username)
    if (user)
      if (this.userService.checkUserPassword(password, user.password))
        return user;
    return null;
  }

  createToken(payload: any, type: any, expiredTime: any) {
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>(type),
      expiresIn: ms(this.configService.get<string>(expiredTime)) / 1000
    })
    return token
  }

  async login(user: IUser, response: Response) {

    if (user === null)
      throw new UnauthorizedException("Check your email or password again.")
    const payload = {
      email: user.email,
      name: user.name,
      _id: user._id,
      address: user.address,
      role: user.role
    }
    const refreshToken = this.createToken(payload, 'JWT_REFRESH_TOKEN', 'JWT_REFRESH_EXPIRE')
    await this.userService.updateUserRefreshToken(refreshToken, user._id)

    response.cookie('refresh_token', refreshToken,
      {
        httpOnly: true,
        maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE'))
      })
    const accessToken = this.createToken(payload, 'JWT_ACCESS_TOKEN', 'JWT_ACCESS_EXPIRE')
    return {
      accessToken,
      user: payload
    }
  }

  async register(createUserDTO: CreateUserDto) {
    const user = await this.userService.create(createUserDTO)
    return {
      _id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt
    }
  }

  async logout(token: string) {
    const decoded = this.jwtService.decode(token)
    const tokenExpiry = decoded.exp * 1000
    const currentTime = Date.now();
    const ttl = tokenExpiry - currentTime;

    if (ttl > 0) {
      await this.redisService.set(token, 'blacklisted', ttl);
    }
  }

  googleLogin(req: { user: any; }) {
    if (!req.user) {
      return 'No user from google'
    }

    return {
      message: 'User information from google',
      user: req.user
    }
  }
}
