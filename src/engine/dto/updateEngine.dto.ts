import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
} from 'class-validator';

export class UpdateEngineDTO {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  @Max(9)
  readonly volume: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  @Max(2000)
  readonly capacity: number;

  @ApiProperty({ type: String, maxLength: 50 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  readonly modelName: string;

  @ApiProperty({
    type: Number,

    description: 'Is optional',
  })
  @IsOptional()
  @IsNumber()
  readonly wasteCity?: number;

  @ApiProperty({ type: Number, description: 'Is optional' })
  @IsOptional()
  @IsNumber()
  readonly wasteOutOfCity?: number;

  @ApiProperty({ type: Number, description: 'Is optional' })
  @IsOptional()
  @IsNumber()
  readonly averageConsumption?: number;
}
