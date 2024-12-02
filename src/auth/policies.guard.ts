import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { CHECK_POLICIES_KEY } from 'src/decorators/policies.decorator';
import { PolicyHandler } from './policy/policies.interface';


@Injectable()
export class PoliciesGuard implements CanActivate {
    constructor(private reflector: Reflector,
        private caslAbilityFactory: CaslAbilityFactory,
    ) { }

    canActivate(context: ExecutionContext): boolean {
        console.log("Vao Policy guard")
        const handlers = this.reflector.get<PolicyHandler[]>(
            CHECK_POLICIES_KEY,
            context.getHandler(),
        );
        if (!handlers) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        console.log("Policy User:::", user)
        const ability = this.caslAbilityFactory.createForUser(user);

        const isAllowed = handlers.every((handler) =>
            typeof handler === 'function' ? handler(ability) : handler.handle(ability),
        );

        if (!isAllowed) {
            throw new ForbiddenException('Access Denied');
        }

        return true;
    }
}
