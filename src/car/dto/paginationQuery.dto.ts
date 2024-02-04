import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
// import { CarOrderingFieldsEnum } from 'src/core/enums/carOrederingFields.enum';
// import { SortDirection } from 'src/core/enums/sortDirection.enum';
import { OrderingFields } from '../types/paginationParams.interface';
import { SortDirection } from 'core/enums/sortDirection.enum';
import { CarOrderingFieldsEnum } from 'core/enums/carOrederingFields.enum';

export class PaginationQueryDTO<T extends OrderingFields> {
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

  @ApiProperty({
    enum: SortDirection,
    required: false,
    default: SortDirection.Descend,
  })
  @IsOptional()
  @IsEnum(SortDirection)
  readonly dir?: SortDirection;

  @ApiProperty({
    required: false,
    default: CarOrderingFieldsEnum.CreatedAt,
    description: 'I will send you correct (enum) if you asked me',
  })
  @IsOptional()
  // @IsEnum(acceptEnum<T>(enumValue))
  readonly ordering?: T;
}
