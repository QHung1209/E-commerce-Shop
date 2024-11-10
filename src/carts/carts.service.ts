import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class CartsService {
  constructor(@InjectModel(Cart.name) private cartModel: SoftDeleteModel<CartDocument>
    // , private productService: ProductsService
  ) { }

  async updateUserCartQuantity(userId: string, product: any) {
    const { productId, quantity } = product
    const query = {
      userId,
      'products.productId': productId,
      state: 'active'
    }, updateSet = {
      $inc: {
        'products.$.quantity': quantity
      }
    }, options = {
      upsert: true,
      new: true
    }
    await this.cartModel.updateOne(query, updateSet, options)
    return this.findAll(userId)
  }

  async createUserCart(userId: string, product: any) {
    const query = { userId, state: 'active' }
    const updateOrInsert = {
      $addToSet: {
        products: product
      }
    }
    const options = { upsert: true, new: true }

    return await this.cartModel.findOneAndUpdate(query, updateOrInsert, options)

  }


  async removeProduct(updateCartDto: UpdateCartDto) {
    const userId = updateCartDto.userId
    const query = { userId, state: 'active' }
    const updateOrInsert = {
      $pull: {
        products: { productId: updateCartDto.product.productId }
      }
    }

    return await this.cartModel.updateOne(query, updateOrInsert)
  }

  async addToCart(createCartDto: CreateCartDto) {
    const userCart = await this.cartModel.findOne({ userId: createCartDto.userId })
    if (!userCart) {
      return this.createUserCart(createCartDto.userId, createCartDto.product)
    }
    const existingProduct = userCart.products.find(
      (item) => item.productId.toString() === createCartDto.product.productId
    );

    if (existingProduct) {
      return this.updateUserCartQuantity(createCartDto.userId, createCartDto.product);
    }
    userCart.products.push(createCartDto.product);
    return userCart.save();

  }

  async addToCartV2(updateCartDto: UpdateCartDto) {
    const { productId, quantity, old_quantity } = updateCartDto.product
    if (quantity == 0)
      return this.removeProduct(updateCartDto)
    return await this.updateUserCartQuantity(updateCartDto.userId, {
      productId,
      quantity: quantity - old_quantity
    })
  }



  async findAll(userId: string) {
    return await this.cartModel.find({ userId })
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
