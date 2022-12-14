import { Module } from '@nestjs/common';
import { CatService } from './cat.service';
import { CatController } from './cat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cat } from './cat.entity';
import { AuthModule } from 'src/auth/auth.module';
import { FoodModule } from 'src/food/food.module';

@Module({
  providers: [CatService],
  controllers: [CatController],
  imports: [TypeOrmModule.forFeature([Cat]), AuthModule, FoodModule],
  exports: [CatService, TypeOrmModule],
})
export class CatModule {}
