import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ObjectId } from 'mongoose';
import { Request } from '@nestjs/common';
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() request: Request) {
    return this.orderService.create(createOrderDto, request);
  }

  @Get()
  findAll(@Req() request: Request, @Query('search') search: string) {
    return this.orderService.findAll(request, search);
  }

  @Get(':id')
  findOne(@Param('id') id: ObjectId, @Req() request: Request) {
    return this.orderService.findOne(id, request);
  }

  @Patch(':id')
  update(
    @Param('id') id: ObjectId,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() request: Request,
  ) {
    return this.orderService.update(id, updateOrderDto, request);
  }

  @Delete(':id')
  remove(@Param('id') id: ObjectId, @Req() request: Request) {
    return this.orderService.remove(id, request);
  }
}
