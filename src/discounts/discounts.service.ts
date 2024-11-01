import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Discount, DiscountDocument } from './schema/discount.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose, { isValidObjectId } from 'mongoose';
import { ProductsService } from 'src/products/products.service';
import { IUser } from 'src/users/user.interface';

@Injectable()
export class DiscountsService {
  constructor(@InjectModel(Discount.name) private discountModel: SoftDeleteModel<DiscountDocument>,
    private productService: ProductsService) { }
  async createDiscountCode() {

  }
  async create(createDiscountDto: CreateDiscountDto, shop: IUser) {
    if (new Date() > new Date(createDiscountDto.start_date) || new Date() > new Date(createDiscountDto.end_date))
      throw new BadRequestException("Check your start date and end date!!!")

    if (new Date(createDiscountDto.start_date) > new Date(createDiscountDto.end_date))
      throw new BadRequestException("Start date must be before end date")

    const isExists = await this.discountModel.findOne({
      code: createDiscountDto.code,
      shop_id: shop._id
    }).lean()
    if (isExists && isExists.is_active)
      throw new BadRequestException("Discount exists")
    const newDiscount = await this.discountModel.create({
      ...createDiscountDto, shop_id: shop._id, createdBy: {
        _id: shop._id,
        email: shop.email
      }
    })
    return newDiscount
  }

  async findAllDiscountCodesWithProduct(currentPage: string, pageSize: string, shopId: string, code: string) {
    const isExists = await this.discountModel.findOne({
      code,
      shop_id: shopId
    }).lean()
    if (!isExists || !isExists.is_active)
      throw new BadRequestException("Discount not exists")
    let products = null
    if (isExists.product_type === 'all') {
      products = this.productService.findAllProductByShopId(currentPage, pageSize, shopId)
    }
    else {
      products = this.productService.findAllProductsInProductIds(currentPage, pageSize, isExists.product_ids)
    }
    return products;
  }

  findOne(id: number) {
    return `This action returns a #${id} discount`;
  }

  update(id: number, updateDiscountDto: UpdateDiscountDto) {
    return `This action updates a #${id} discount`;
  }

  remove(id: number) {
    return `This action removes a #${id} discount`;
  }
}
