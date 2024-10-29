import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument, ProductSchema } from './schemas/product.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/user.interface';
import aqp from 'api-query-params';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: SoftDeleteModel<ProductDocument>) { }

  async create(createProductDto: CreateProductDto, shop: IUser) {
    const newProduct = await this.productModel.create({ ...createProductDto, shop_id: shop._id })
    return newProduct;
  }

  async findAllProductByShopId(currentPage: string, pageSize: string, qs: string) {
    const { filter, sort, projection, population } = aqp(qs)
    delete filter.current;
    delete filter.pageSize;
    console.log(filter)

    let offset = (+currentPage - 1) * (+pageSize)
    let defaultLimit = +pageSize ? +pageSize : 10

    const totalItems = (await this.productModel.find(filter)).length
    console.log(totalItems)
    const totalPages = Math.ceil(totalItems / defaultLimit)
    const result = await this.productModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
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

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
