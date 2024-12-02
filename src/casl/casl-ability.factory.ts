import { AbilityBuilder, createMongoAbility, ExtractSubjectType, InferSubjects, MongoAbility, MongoQuery } from "@casl/ability";
import { Cart } from "src/carts/schemas/cart.schema";
import { Checkout } from "src/checkouts/schemas/checkout.schema";
import { Comment } from "src/comments/schemas/comment.schema";
import { Discount } from "src/discounts/schema/discount.schema";
import { Inventory } from "src/inventories/schemas/inventory.schema";
import { Order } from "src/orders/schemas/order.schema";
import { Product } from "src/products/schemas/product.schemas";
import { User } from "src/users/schemas/user.schema";
import { Notification } from 'src/notifications/schemas/notification.schema';
import { Injectable } from "@nestjs/common";

type Subjects = InferSubjects<typeof User | typeof Product | typeof Order | typeof Cart | typeof Checkout | typeof Comment | typeof Discount | typeof Inventory | typeof Notification> | 'all';
export enum Action {
    Manage = 'manage',
    Create = 'create',
    Read = 'read',
    Update = 'update',
    Delete = 'delete',
}

type PossibleAbilities = [Action, Subjects];
type Conditions = MongoQuery<User>;

export type AppAbility = MongoAbility<PossibleAbilities, Conditions>;

@Injectable()
export class CaslAbilityFactory {
    createForUser(user: User) {
        const { can, cannot, build } = new AbilityBuilder(createMongoAbility<PossibleAbilities, Conditions>);

        if (user.role === 'Admin') {
            can(Action.Manage, 'all');
            cannot(Action.Delete, User, { _id: user._id });
        } else if (user.role === 'User') {
            can(Action.Read, Checkout, { userId: user._id })
            can(Action.Read, Notification, { receiverId: user._id })
            can([Action.Read, Action.Delete], Order, { userId: user._id })
        }
        else if (user.role === 'Shop') {
            can(Action.Manage, Product, { shopId: user._id })
            can(Action.Manage, Inventory, { shopId: user._id })
            can(Action.Manage, Discount, { shopId: user._id })
            can(Action.Manage, Notification, { senderId: user._id })
        }
        can([Action.Update, Action.Read], Cart, { userId: user._id })
        can(Action.Read, Discount)
        can(Action.Read, Product);
        can([Action.Read, Action.Update], User, { _id: user._id });
        can([Action.Manage], Comment, { userId: user._id });


        return build({
            detectSubjectType: (item) =>
                item.constructor as ExtractSubjectType<Subjects>,
        });
    }
}
