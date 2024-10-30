import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument, ProductSchema } from './schemas/product.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/user.interface';
import aqp from 'api-query-params';
import { isValidObjectId } from 'mongoose';
import { InventoriesService } from 'src/inventories/inventories.service';
import { CreateInventoryDto } from 'src/inventories/dto/create-inventory.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: SoftDeleteModel<ProductDocument>,
    private inventoryService: InventoriesService) { }

  async create(createProductDto: CreateProductDto, shop: IUser) {
    const newProduct = await this.productModel.create({
      ...createProductDto, shop_id: shop._id, createdBy: {
        _id: shop._id,
        email: shop.email
      }
    })
    await this.inventoryService.create({
      shop_id: shop._id,
      product_id: newProduct.id,
      stock: newProduct.product_quantity,
      location: shop.address,
      reservations: []
    });
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

  async findProductById(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException("Product Id invalid");
    }
    const product = await this.productModel.findById(id)
    if (!product)
      throw new BadRequestException("Product Id not found")
    return product
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException("Product Id invalid");
    }
    const product = await this.productModel.findById(id)
    if (!product)
      throw new BadRequestException("Product Id not found")
    await this.productModel.updateOne({ _id: id }, { ...updateProductDto })
    const updatedProduct = await this.productModel.findById(id)
    return updatedProduct;
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException("Product Id invalid");
    }
    const product = await this.productModel.findById(id)
    if (!product)
      throw new BadRequestException("Product Id not found")
    await this.productModel.softDelete({ _id: id })
    return `removes a #${id} product`;
  }
}
