import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Account } from 'src/auth/account.entity';
import { imageFileConfigs } from 'src/common/configs/file-interceptor.config';
import { CurrentAccount } from 'src/common/decorators/current-user';
import { PaginationParams } from 'src/common/dtos/pagination.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { UploadInterceptor } from 'src/common/interceptors/upload-interceptor';
import { CatService } from './cat.service';
import { CreateCatDTo } from './dto/create.cat';

@Controller('cats')
export class CatController {
  constructor(private readonly catService: CatService) {}

  @Get()
  async findAll(
    @Query()
    pagination: PaginationParams,
  ) {
    return await this.catService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.catService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(
    @Body() createCatDto: CreateCatDTo,
    @CurrentAccount() by: Account,
  ) {
    return await this.catService.create(createCatDto, by);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentAccount() by: Account,
  ) {
    return await this.catService.delete(id, by);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() cat: CreateCatDTo,
    @CurrentAccount() by: Account,
  ) {
    return await this.catService.update(id, cat, by);
  }

  @Get('by-account/:id')
  async findByAccount(@Param('id') id: number) {
    return this.catService.findByAccount(id);
  }

  @Post('file/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file', imageFileConfigs), UploadInterceptor)
  @ApiConsumes('mutipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
    @CurrentAccount() by: Account,
  ) {
    return await this.catService.updateImage(id, by, file);
  }
}
