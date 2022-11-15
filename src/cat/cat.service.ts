import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/auth/account.entity';
import {
  PaginationMeta,
  PaginationParams,
} from 'src/common/dtos/pagination.dto';
import { EnumCatGender } from 'src/common/enums/cat.gender.enum';
import { AppError } from 'src/common/exceptions/app-error';
import { removeFileExists } from 'src/common/untils/fs.until';
import { Food } from 'src/food/food.entity';
import { FoodService } from 'src/food/food.service';
import { Repository } from 'typeorm';
import { Cat } from './cat.entity';
import { PaginatedCat } from './dto/cat-pagination.dto';
import { CreateCatDTo } from './dto/create.cat';

@Injectable({ scope: Scope.REQUEST })
export class CatService {
  constructor(
    @InjectRepository(Cat)
    private readonly catRepo: Repository<Cat>,
    private readonly foodService: FoodService,
  ) {}

  async findAll(pagination: PaginationParams): Promise<PaginatedCat> {
    const catBuilder = this.catRepo.createQueryBuilder('cat');
    const [data, total] = await catBuilder
      .skip(pagination.skip)
      .take(pagination.skip)
      .getManyAndCount();

    return new PaginatedCat(
      data,
      new PaginationMeta({ params: pagination, total }),
    );
  }

  async findOne(id: number): Promise<Cat> {
    return await this.catRepo.findOne({
      where: { id },
      relations: ['owner', 'foods'],
    });
  }

  async create(createCatDto: CreateCatDTo, by: Account): Promise<Cat> {
    if (
      createCatDto.gender &&
      !Object.values(EnumCatGender).includes(createCatDto.gender)
    ) {
      throw new AppError('invalid gender', 400);
    }

    if (by) {
      const newCat = await this.catRepo.create({ ...createCatDto, owner: by });
      return await this.catRepo.save(newCat);
    }
    throw new UnauthorizedException();
  }

  async delete(id: number, by: Account): Promise<any> {
    const currentCat = await this.findOne(id);

    if (!currentCat) {
      throw new NotFoundException('cat not found');
    }

    const isOwner = currentCat.owner.id === by.id;
    if (isOwner) {
      return await this.catRepo.delete({ id });
    }
    throw new UnauthorizedException();
  }

  async update(id: number, cat: CreateCatDTo, by: Account): Promise<Cat> {
    const currentCat = this.findOne(id);
    if (!currentCat) {
      throw new NotFoundException(' cat not found');
    }

    if (by && (await currentCat).owner.id === by.id) {
      return await this.catRepo.save({ ...currentCat, ...cat, id });
    }
    throw new UnauthorizedException();
  }

  async findByAccount(id: number) {
    const [cats] = await this.catRepo
      .createQueryBuilder('cat')
      .where('cat.ownerId = :id', { id })
      .getManyAndCount();
    return cats;
  }

  async updateImage(id: number, by: Account, file: Express.Multer.File) {
    const currentCat = await this.findOne(id);
    if (currentCat) {
      if (currentCat.owner.id === by.id) {
        await this.catRepo.save({ ...currentCat, image: file.path });
        if (currentCat.image) {
          removeFileExists(currentCat.image);
        }
        return { ...currentCat, image: file.path };
      } else {
        removeFileExists(file.path);
        throw new UnauthorizedException();
      }
    }
    removeFileExists(file.path);
    throw new BadRequestException('cat not found');
  }

  async feed(id: number, foodIds: number[], by: Account) {
    const currentCat = await this.findOne(id);
    if (currentCat.owner.id === by.id) {
      const foodsByIds = await this.foodService.findByIds(foodIds);

      const legal =
        foodsByIds.filter((food: Food) => food.minAge > currentCat.age)
          .length === 0;

      if (legal) {
        currentCat.foods = foodsByIds;
        await this.catRepo.save(currentCat);
        return true;
      }
      throw new BadRequestException('some foods not suit the cat');
    }
    throw new UnauthorizedException();
  }
}
