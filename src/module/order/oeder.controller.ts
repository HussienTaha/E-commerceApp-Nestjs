import type { HUserDocument } from 'src/DB';
import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { Roles, Token, TokenType, USER_ROLE, UserDecorator } from 'src/common';
import { AuthenticationGuard } from 'src/common/guards';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { Types } from 'mongoose';
import { OrderService } from './order.service';
import { cancleOrderDto, CreateOrderDto } from './order.dto';
import { IdDto } from '../brand/brand.dto';
 

@Controller('orders')
export class OrderController {
  constructor(private readonly OrderService: OrderService) {}



  @Token(TokenType.access)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
  @Post('/create')
  async createOrder(
    @Body() OrderDto: CreateOrderDto,
    @UserDecorator() user: HUserDocument,
  ) {
    const order = await this.OrderService.createOrder(OrderDto, user);
    return { message: 'Order created successfully  ',   order };
  }


  @Token(TokenType.access)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
  @Patch('/cancel/:id')

  async cancelOrder(
    @Param() Params: IdDto,
    @UserDecorator() user: HUserDocument,
  ) {
    const order = await this.OrderService.cancelOrder( Params.id, user);
    return { message: 'Order  canceled successfully  ',   order };
  }

}
