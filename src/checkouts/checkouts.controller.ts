import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CheckoutsService } from './checkouts.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { User } from 'src/decorators/user.decorator';
import { IUser } from 'src/users/user.interface';

@Controller('checkouts')
export class CheckoutsController {
  constructor(private readonly checkoutsService: CheckoutsService) { }


  @Get()
  checkout(@Body() createCheckoutDto: CreateCheckoutDto, @User() user: IUser) {
    return this.checkoutsService.checkoutReview(createCheckoutDto, user);
  }

  @Post("order")
  order(@Body() createCheckoutDto: CreateCheckoutDto, @User() user: IUser) {
    return this.checkoutsService.orderByUser(createCheckoutDto, user);
  }
}
