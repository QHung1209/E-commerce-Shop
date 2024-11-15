import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ResponseMessage } from 'src/decorators/customize';
import { User } from 'src/decorators/user.decorator';
import { IUser } from 'src/users/user.interface';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) { }

  @Post()
  @ResponseMessage("Create cart")
  create(@Body() createCartDto: CreateCartDto, @User() user: IUser) {
    return this.cartsService.addToCart(createCartDto, user);
  }

  @Get()
  @ResponseMessage("Get all products in cart")
  getAllProductsInCart(@User() user: IUser) {
    return this.cartsService.findAll(user);
  }

  @Post("update")
  @ResponseMessage("Update product in cart")
  update(@Body() updateCartDto: UpdateCartDto, @User() user: IUser) {
    return this.cartsService.addToCartV2(updateCartDto, user);
  }

  @Delete()
  @ResponseMessage("Remove product from cart")
  remove(@Body("productId") productId: string, @User() user: IUser) {
    return this.cartsService.removeProduct(productId, user);
  }

}
