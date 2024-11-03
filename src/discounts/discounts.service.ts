import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Discount, DiscountDocument } from './schema/discount.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose, { isValidObjectId } from 'mongoose';
import { ProductsService } from 'src/products/products.service';
import { IUser } from 'src/users/user.interface';
import { UsersService } from '../users/users.service';
import { Product } from 'src/products/schemas/product.schemas';

@Injectable()
export class DiscountsService {
  constructor(@InjectModel(Discount.name) private discountModel: SoftDeleteModel<DiscountDocument>,
    private productService: ProductsService,
    private userService: UsersService) { }
  async createDiscountCode() {

  }
  async create(createDiscountDto: CreateDiscountDto, shop: IUser) {
    if (new Date().toLocaleDateString() > new Date(createDiscountDto.start_date).toDateString() || new Date() > new Date(createDiscountDto.end_date))
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

  async getAllDiscountProductsWithCode(currentPage: string, pageSize: string, shopId: string, code: string) {
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
    else if (isExists.product_type === 'specific') {
      products = this.productService.findAllProductsInProductIds(currentPage, pageSize, isExists.product_ids)
    }
    return products;
  }

  async getAllDiscountCodesWithShopId(currentPage: string, pageSize: string, shopId: string) {
    const isShopExists = await this.userService.findByUserId(shopId)
    if (!isShopExists)
      throw new BadRequestException("Shop Id invalid")
    let offset = (+currentPage - 1) * (+pageSize)
    let defaultLimit = +pageSize ? +pageSize : 10

    const totalItems = (await this.discountModel.find({ shop_id: shopId }).lean()).length
    const totalPages = Math.ceil(totalItems / defaultLimit)
    const result = await this.discountModel.find({ shop_id: shopId }).lean()
      .skip(offset)
      .limit(defaultLimit)
      .exec();
    return {
      meta: {
        current: currentPage,
        pageSize: pageSize,
        pages: totalPages,
        total: totalItems,

      }, result: result
    }

  }

  /*
  Apply Discount Code
  products: [
     {
    name,
    price,
    quantity,
    shopId
    },
     {
    name,
    price,
    quantity,
    shopId
    },
  ]
  */
  async getDiscountAmount(userId: string, shopId: string, code: string, products: Array<Record<string, any>>) {
    const isExists = await this.discountModel.findOne({
      code: code,
      shop_id: shopId
    }).lean()
    if (!isExists || !isExists.is_active)
      throw new BadRequestException("Discount doesn't exists or expried")
    const {
      max_uses,
      uses_count,
      min_order_value,
      max_uses_per_user,
      start_date, end_date,
      users_used,
      value,
      type
    } = isExists
    if (max_uses === uses_count)
      throw new BadRequestException("Discount is out")
    if (new Date() < start_date || end_date < new Date())
      throw new BadRequestException("Discount code has expried")

    let totalOrderValue = 0
    if (min_order_value > 0) {
      totalOrderValue = products.reduce((acc, product) => {
        return acc + (product.price * product.quantity)
      }, 0)
      if (totalOrderValue < min_order_value)
        throw new BadRequestException(`Discount require a min order value of ${min_order_value}`)
    }

    if (max_uses_per_user > 0) {
      const userUseDiscountCount = users_used.filter(user => user.toString() === userId).length
      if (userUseDiscountCount === max_uses_per_user)
        throw new BadRequestException("This user has used up all of these discounts")
    }

    const amount = type === 'fix_amount' ? value : totalOrderValue * value / 100
    return {
      totalOrderValue,
      discount: amount,
      totalPrice: totalOrderValue - amount
    }
  }

  async deleteDiscount(shopId: string, code: string) {
    const deleted = await this.discountModel.softDelete({ shop_id: shopId, code })
    return deleted
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
