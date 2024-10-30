import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from 'src/decorators/user.decorator';
import { IUser } from 'src/users/user.interface';
import { ResponseMessage } from '../decorators/customize';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @ResponseMessage("Create new product")
  create(@Body() createProductDto: CreateProductDto, @User() user: IUser) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @ResponseMessage("Get all product")
  findAllProductByShopId(@Query('current') currentPage: string, @Query('pageSize') pageSize: string, @Query() qs: string) {
    return this.productsService.findAllProductByShopId(currentPage, pageSize, qs);
  }

  @Get(':id')
  @ResponseMessage("Get product by id")
  findOne(@Param('id') id: string) {
    return this.productsService.findProductById(id);
  }

  @Patch(':id')
  @ResponseMessage("Update product by id")
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ResponseMessage("Delete product")
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
