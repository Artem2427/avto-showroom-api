import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class BrandUpdateDTO {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @IsNumberString()
  readonly phone: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  readonly name: string;

  @ApiProperty({ type: String, format: 'binary', required: false })
  @IsOptional()
  readonly file?: Express.Multer.File;
}
