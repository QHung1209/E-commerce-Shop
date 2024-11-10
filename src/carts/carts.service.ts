import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { ProductsService } from 'src/products/products.service';
import { IUser } from 'src/users/user.interface';

@Injectable()
export class CartsService {
  constructor(@InjectModel(Cart.name) private cartModel: SoftDeleteModel<CartDocument>
    // , private productService: ProductsService
  ) { }

  async updateUserCartQuantity(user: IUser, product: any) {
    const { _id, email } = user
    const { productId, quantity } = product
    const query = {
      userId: _id,
      'products.productId': productId,
      state: 'active'
    }, updateSet = {
      $inc: {
        'products.$.quantity': quantity
      },
      updatedBy: {
        _id,
        email
      }

    }, options = {
      upsert: true,
      new: true
    }
    return await this.cartModel.findOneAndUpdate(query, updateSet, options)
  }

  async createUserCart(user: IUser, product: any) {
    const { _id, email } = user
    const query = { userId: _id, state: 'active' }
    const updateOrInsert = {
      $addToSet: {
        products: product
      },
      createdBy: {
        _id,
        email
      }
    }
    const options = { upsert: true, new: true }

    return await this.cartModel.findOneAndUpdate(query, updateOrInsert, options)

  }


  async removeProduct(updateCartDto: UpdateCartDto, user: IUser) {
    const userId = user._id
    const query = { userId, state: 'active' }
    const updateOrInsert = {
      $pull: {
        products: { productId: updateCartDto.product.productId }
      }
    }

    return await this.cartModel.updateOne(query, updateOrInsert)
  }

  async addToCart(createCartDto: CreateCartDto, user: IUser) {
    const userCart = await this.cartModel.findOne({ userId: user._id }).lean()
    if (!userCart) {
      return this.createUserCart(user, createCartDto.product)
    }
    const existingProduct = userCart.products.find(
      (item) => item.productId.toString() === createCartDto.product.productId
    );

    if (existingProduct) {
      return this.updateUserCartQuantity(user, createCartDto.product);
    }
    userCart.products.push(createCartDto.product);
    return userCart.save();

  }

  async addToCartV2(updateCartDto: UpdateCartDto, user: IUser) {
    const { productId, quantity, old_quantity } = updateCartDto.product
    if (quantity == 0)
      return this.removeProduct(updateCartDto, user)
    return await this.updateUserCartQuantity(user, {
      productId,
      quantity: quantity - old_quantity
    })
  }



  async findAll(user: IUser) {
    return await this.cartModel.find({ id: user._id }).lean()
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