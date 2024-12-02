import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        console.log("Vao roles guard")
        const requiredRoles = this.reflector.getAllAndOverride<string[]>('role', [
            context.getHandler(),
            context.getClass(),
        ]);
        console.log('Required Roles:', requiredRoles);
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!requiredRoles)
            return true

        return requiredRoles.some(role => user?.role?.includes(role))
    }
}