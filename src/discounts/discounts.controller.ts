import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { User } from 'src/decorators/user.decorator';
import { IUser } from 'src/users/user.interface';
import { ResponseMessage } from 'src/decorators/customize';
import { CheckPolicies } from 'src/decorators/policies.decorator';
import { Action, AppAbility } from 'src/casl/casl-ability.factory';
import { Discount } from './schema/discount.schema';

@Controller('discounts')
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) { }

  @Post()
  @ResponseMessage("Create Discount")
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, Discount),
  )
  create(@Body() createDiscountDto: CreateDiscountDto, @User() shop: IUser) {
    return this.discountsService.create(createDiscountDto, shop);
  }

  @Get("/products")
  @ResponseMessage("Get All Discount Products By Code")
  findAllDiscountProductsWithCode(@Query('current') currentPage: string, @Query('pageSize') pageSize: string, @Query('shopId') shopId: string, @Query('code') code: string) {
    return this.discountsService.getAllDiscountProductsWithCode(currentPage, pageSize, shopId, code)
  }

  @Get("/codes")
  @ResponseMessage("Get All Discount Codes By Shop Id")
  findAllDiscountCodesWithShopId(@Body('current') currentPage: string, @Body('pageSize') pageSize: string, @Body('shopId') shopId: string) {
    return this.discountsService.getAllDiscountCodesWithShopId(currentPage, pageSize, shopId)
  }

  @Get("/discount-amount")
  @ResponseMessage("Get Discount Amount")
  getDiscountAmount(@Body("userId") userId: string, @Body("shopId") shopId: string, @Body("code") code: string, @Body("products") products: Array<Record<string, any>>) {
    return this.discountsService.getDiscountAmount(userId, shopId, code, products)
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDiscountDto: UpdateDiscountDto) {
    return this.discountsService.update(+id, updateDiscountDto);
  }

  @Delete()
  @ResponseMessage("Delet Discount")
  delete(@Body('shopId') shopId: string, @Body('code') code: string) {
    return this.discountsService.deleteDiscount(shopId, code);
  }
}
