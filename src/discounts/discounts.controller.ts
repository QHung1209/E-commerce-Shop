import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { User } from 'src/decorators/user.decorator';
import { IUser } from 'src/users/user.interface';

@Controller('discounts')
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) { }

  @Post()
  create(@Body() createDiscountDto: CreateDiscountDto, @User() shop: IUser) {
    return this.discountsService.create(createDiscountDto, shop);
  }

  @Get()
  findAll(@Query('current') currentPage: string, @Query('pageSize') pageSize: string, @Query('shopId') shopId: string, @Query('code') code: string) {
    return this.discountsService.findAllDiscountCodesWithProduct(currentPage, pageSize, shopId, code)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.discountsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDiscountDto: UpdateDiscountDto) {
    return this.discountsService.update(+id, updateDiscountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.discountsService.remove(+id);
  }
}
