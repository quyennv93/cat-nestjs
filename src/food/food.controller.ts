import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role';
import { EnumRole } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { RoleGuard } from 'src/common/guard/role.guard';
import { CreateFoodDto } from './dto/create-food';
import { FoodService } from './food.service';

@Controller('foods')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get()
  findAll() {
    return this.foodService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.foodService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(EnumRole.ADMIN)
  @ApiBearerAuth()
  create(@Body() foodDto: CreateFoodDto) {
    return this.foodService.create(foodDto);
  }

  @Get('by-min-age/:age')
  findByMinAge(@Param('age', ParseIntPipe) age: number) {
    return this.foodService.findByMinAge(age);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(EnumRole.ADMIN)
  @ApiBearerAuth()
  delete(@Param('id') id: number) {
    return this.foodService.delete(id);
  }
}
