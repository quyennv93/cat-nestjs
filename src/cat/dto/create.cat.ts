import { ApiProperty } from '@nestjs/swagger';
import { EnumCatGender } from 'src/common/enums/cat.gender.enum';

export class CreateCatDTo {
  @ApiProperty()
  name: string;
  @ApiProperty({ enum: EnumCatGender, default: EnumCatGender.MALE })
  gender: EnumCatGender;
  @ApiProperty()
  age: number;
}
