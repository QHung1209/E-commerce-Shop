import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/decorators/customize';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector,
        private redisService: RedisService
    ) {
        super()
    }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()]);

        if (isPublic)
            return true;
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1]; 

        if (!token) {
        return false; 
        }

        const isBlacklisted = await this.redisService.get(token);
        if (isBlacklisted) {
        return false; 
        }
        return super.canActivate(context) as Promise<boolean>;;
    }

    handleRequest(err, user, info) {
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user) {
            throw err || new UnauthorizedException("Token invalid");
        }
        return user;
    }
}
