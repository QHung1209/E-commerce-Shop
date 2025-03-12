import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { UpdateCheckoutDto } from './dto/update-checkout.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Checkout, CheckoutDocument } from './schemas/checkout.schema';
import { CartsService } from 'src/carts/carts.service';
import { IUser } from 'src/users/user.interface';
import { ProductsService } from 'src/products/products.service';
import { DiscountsService } from 'src/discounts/discounts.service';
import { RedisService } from 'src/redis/redis.service';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class CheckoutsService {
  constructor(
    @InjectModel(Checkout.name) private checkoutModel: SoftDeleteModel<CheckoutDocument>,
    private cartService: CartsService,
    private productService: ProductsService,
    private discountService: DiscountsService,
    private redisService: RedisService,
    private orderService: OrdersService
  ) { }

  async checkoutReview(createCheckoutDto: CreateCheckoutDto, user: IUser) {
    const { cartId, shop_order } = createCheckoutDto
    const existingCart = this.cartService.getCartByCartId(cartId)
    if (!existingCart)
      throw new NotFoundException("Cart does not exists!")
    const checkout_order = {
      totalPrice: 0,
      freeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0
    }, shop_order_new = []

    for (let order of shop_order) {
      const { shopId, shop_discount, products } = order
      const checkProductServer = await this.productService.checkProductByServer(products)
      if (!checkProductServer[0])
        throw new BadRequestException("Order wrong")
      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + (Number(product.price) * product.quantity)
      }, 0)
      checkout_order.totalPrice += checkoutPrice
      const itemCheckout = {
        shopId, shop_discount, priceRaw: checkoutPrice,
        priceApplyCheckout: checkoutPrice,
        itemProducts: checkProductServer
      }

      if (shop_discount) {
        const { discount } = await this.discountService.getDiscountAmount(String(user._id), shopId, shop_discount.code, checkProductServer)
        checkout_order.totalDiscount = discount

        if (discount > 0) {
          itemCheckout.priceApplyCheckout = checkoutPrice - discount
        }
      }
      checkout_order.totalCheckout += itemCheckout.priceApplyCheckout
      shop_order_new.push(itemCheckout)
    }
    return {
      shop_order,
      shop_order_new,
      checkout_order
    }

  }

  async orderByUser(createCheckoutDto: CreateCheckoutDto, user: IUser) {
    const { shop_order_new, checkout_order } = await this.checkoutReview(createCheckoutDto, user)
    const products = shop_order_new.flatMap(order => order.itemProducts)
    console.log(products)
    const acquireProduct = []
    for (let product of products) {
      const { productId, quantity } = product
      const keyLock = await this.redisService.acquireLock(productId, quantity, createCheckoutDto.cartId)
      acquireProduct.push(keyLock ? true : false)
      if (keyLock)
        await this.redisService.releaseLock(keyLock)
    }
    if (acquireProduct.includes(false))
      throw new BadRequestException("Some products have been changed!, try later!")

    const newOrder = await this.orderService.createOrder(String(user._id), checkout_order, user.address, "COD", products)
    if (newOrder) {
      for (let product of products) {
        await this.cartService.removeProduct(product, user)
      }
    }
    return newOrder;
  }


}
