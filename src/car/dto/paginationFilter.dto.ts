import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { CarFilterFieldsEnum, FilterParamsValuesType } from '../../../core/enums/carFilter.enum';
// import {
//   CarFilterFieldsEnum,
//   FilterParamsValuesType,
// } from 'src/core/enums/carFilter.enum';

export class PaginationFilterDTO {
  @ApiProperty({ enum: CarFilterFieldsEnum, required: true })
  @IsEnum(CarFilterFieldsEnum)
  readonly field: CarFilterFieldsEnum;

  @ApiProperty({ enum: FilterParamsValuesType, required: true })
  @IsEnum(FilterParamsValuesType)
  readonly type: FilterParamsValuesType;

  @ApiProperty({ type: String, nullable: true, example: null })
  @IsNotEmpty()
  readonly from: string;

  @ApiProperty({ type: String, nullable: true, example: null })
  @IsNotEmpty()
  readonly to: string;

  @ApiProperty({ type: Boolean, default: false })
  @IsBoolean()
  readonly disabled;

  @ApiProperty({
    type: [String],
    default: [],
    example: [
      'ba74133a-f736-4dbe-b01b-5a935e64480c',
      'ba74133a-f736-4dbe-b01b-5a935e64480c',
    ],
    isArray: true,
  })
  @IsUUID('all', { each: true, message: 'Not valid Id' })
  readonly values: string[];
}
