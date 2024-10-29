import { Controller, Post, UseGuards, Res, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage } from 'src/decorators/customize';
import { Response } from 'express';
import { LocalAuthGuard } from './local.auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/users/dto/create-user.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req: any, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response)
  }

  @Public()
  @ResponseMessage("Register a new user")
  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto)
  }
}
