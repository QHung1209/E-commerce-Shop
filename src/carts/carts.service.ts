import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { ProductsService } from 'src/products/products.service';
import { IUser } from 'src/users/user.interface';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class CartsService {
  private readonly CACHE_TTL = 1800;
  constructor(@InjectModel(Cart.name) private cartModel: SoftDeleteModel<CartDocument>
    , private redisClient: RedisService
  ) { }

  private getCacheKey(userId: string) {
    return `cart:${userId}`;
  }

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
    await this.redisClient.del(this.getCacheKey(String(user._id)));
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
    await this.redisClient.del(this.getCacheKey(String(user._id)));
    return await this.cartModel.findOneAndUpdate(query, updateOrInsert, options)

  }


  async removeProduct(productId: string, user: IUser) {
    const userId = user._id
    const query = { userId, state: 'active' }
    const updateOrInsert = {
      $pull: {
        products: { productId }
      }
    }
    await this.redisClient.del(this.getCacheKey(String(user._id)));
    return await this.cartModel.updateOne(query, updateOrInsert)
  }

  async addToCart(createCartDto: CreateCartDto, user: IUser) {
    const userCart = await this.cartModel.findOne({ userId: user._id })
    if (!userCart) {
      return this.createUserCart(user, createCartDto.product)
    }
    const existingProduct = userCart.products.find(
      (item) => item.productId.toString() === createCartDto.product.productId
    );

    if (existingProduct) {
      return this.updateUserCartQuantity(user, createCartDto.product);
    }
    await this.redisClient.del(this.getCacheKey(String(user._id)));
    userCart.products.push(createCartDto.product);
    return userCart.save();

  }

  async addToCartV2(updateCartDto: UpdateCartDto, user: IUser) {
    const { productId, quantity, old_quantity } = updateCartDto.product
    if (quantity === 0)
      return this.removeProduct(updateCartDto.product.productId, user)
    return await this.updateUserCartQuantity(user, {
      productId,
      quantity: quantity - old_quantity
    })
  }

  async findAll(user: IUser) {
    const cacheKey = this.getCacheKey(String(user._id));
    const cachedCart = await this.redisClient.get(cacheKey);

    if (cachedCart) {
      return JSON.parse(cachedCart);
    }


    const cart = await this.cartModel.find({ userId: user._id }).lean();
    await this.redisClient.setEX(cacheKey, JSON.stringify(cart), this.CACHE_TTL);
    return cart;
  }

  async getCartByCartId(cartId: string) {
    return await this.cartModel.findById(cartId)
  }

}
