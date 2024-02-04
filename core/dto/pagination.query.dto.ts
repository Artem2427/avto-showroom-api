import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class PaginationQueryDTO {
  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  readonly page: number;

  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  readonly pageSize: number;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  readonly searchTerm?: string;
}
