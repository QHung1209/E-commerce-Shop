import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ResponseMessage } from 'src/decorators/customize';
import { User } from 'src/decorators/user.decorator';
import { IUser } from 'src/users/user.interface';
import { CheckPolicies } from 'src/decorators/policies.decorator';
import { Action, AppAbility } from 'src/casl/casl-ability.factory';
import { Cart } from './schemas/cart.schema';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) { }

  @Post()
  @ResponseMessage("Create cart")
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Cart))
  create(@Body() createCartDto: CreateCartDto, @User() user: IUser) {
    return this.cartsService.addToCart(createCartDto, user);
  }

  @Get()
  @ResponseMessage("Get all products in cart")
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Cart))
  getAllProductsInCart(@User() user: IUser) {
    return this.cartsService.findAll(user);
  }

  @Post()
  @ResponseMessage("Update product in cart")
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Cart))
  update(@Body() updateCartDto: UpdateCartDto, @User() user: IUser) {
    return this.cartsService.addToCartV2(updateCartDto, user);
  }

  @Delete()
  @ResponseMessage("Remove product from cart")
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Cart))
  remove(@Body("productId") productId: string, @User() user: IUser) {
    return this.cartsService.removeProduct(productId, user);
  }

}
