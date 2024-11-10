import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ResponseMessage } from 'src/decorators/customize';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) { }

  @Post()
  @ResponseMessage("Create cart")
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartsService.addToCart(createCartDto);
  }

  @Get()
  @ResponseMessage("Get all products in cart")
  getAllProductsInCart(@Body("userId") userId: string) {
    return this.cartsService.findAll(userId);
  }

  @Post("update")
  @ResponseMessage("Update product in cart")
  update(@Body() updateCartDto: UpdateCartDto) {
    return this.cartsService.addToCartV2(updateCartDto);
  }

  @Delete()
  @ResponseMessage("Remove product from cart")
  remove(@Body() updateCartDto: UpdateCartDto) {
    return this.cartsService.removeProduct(updateCartDto);
  }

}
