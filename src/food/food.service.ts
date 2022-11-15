import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFoodDto } from './dto/create-food';
import { Food } from './food.entity';

@Injectable()
export class FoodService {
  constructor(
    @InjectRepository(Food) private readonly foodRepo: Repository<Food>,
  ) {}

  async findAll(): Promise<Food[]> {
    return this.foodRepo.find();
  }
  async findOne(id: number): Promise<Food> {
    return this.foodRepo.findOne({
      where: { id: id },
      relations: ['cats'],
    });
  }

  async create(foodDto: CreateFoodDto) {
    return this.foodRepo.save(foodDto);
  }

  async findByMinAge(age: number) {
    const foods = await this.foodRepo
      .createQueryBuilder('food')
      .where('food.minAge >= :age', { age })
      .getMany();
    return foods;
  }

  async findByIds(ids: number[]) {
    const foods = await this.foodRepo
      .createQueryBuilder('food')
      .where('food.id IN (:...ids)', { ids })
      .getMany();

    return foods;
  }

  async delete(id: number) {
    return await this.foodRepo.delete(id);
  }
}
