import { Controller, Post, UseGuards, Res, Request, Body, SetMetadata, Req, UnauthorizedException, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage } from 'src/decorators/customize';
import { Response, Request as RequestE } from 'express';
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

  @Post('logout')
  async logout(@Req() request: RequestE, @Res() response: Response) {
    const authHeader = request.headers.authorization as string | undefined;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token is missing');
    }

    const token = authHeader.split(' ')[1];

    await this.authService.logout(token);

    response.clearCookie('refresh_token', { httpOnly: true });

    return response.json({ message: 'Logged out successfully' });
  }

  @Public()
  @Get("google")
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() response: Response) {
    const result = await this.authService.googleLogin(req, response);
    return response.json(result);
  }
}
