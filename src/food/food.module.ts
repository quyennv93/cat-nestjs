import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodController } from './food.controller';
import { Food } from './food.entity';
import { FoodService } from './food.service';

@Module({
  controllers: [FoodController],
  providers: [FoodService],
  imports: [TypeOrmModule.forFeature([Food])],
  exports: [FoodService, TypeOrmModule],
})
export class FoodModule {}
