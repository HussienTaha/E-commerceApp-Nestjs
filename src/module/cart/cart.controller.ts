import type { HUserDocument } from 'src/DB';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import {  CreateCartDto,  } from './cart.dto';
import { Roles, Token, TokenType, USER_ROLE, UserDecorator } from 'src/common';
import { AuthenticationGuard } from 'src/common/guards';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { Types } from 'mongoose';

@Controller('cart')
export class CartController {
  constructor(private readonly CartService: CartService) {}

  @Token(TokenType.access)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER)
  @Post('/create')
  async createCart(
    @Body() CartDto: CreateCartDto,
    @UserDecorator() user: HUserDocument,
  ) {
    const Cart = await this.CartService.createCart(CartDto, user);
    return { message: 'Cart created successfully', Cart };
  }
}
