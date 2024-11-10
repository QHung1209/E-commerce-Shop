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

@Injectable()
export class CheckoutsService {
  constructor(
    @InjectModel(Checkout.name) private checkoutModel: SoftDeleteModel<CheckoutDocument>,
    private cartService: CartsService,
    private productService: ProductsService,
    private discountService: DiscountsService
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
        const { discount } = await this.discountService.getDiscountAmount(user._id, shopId, shop_discount.code, checkProductServer)
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


}
