import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import { CurrencyEnum } from '../../../core/enums/currency.enum';
// import { CurrencyEnum } from 'src/core/enums/currency.enum';

export class UpdateCarDTO {
  @ApiProperty({ type: Number, minimum: 0 })
  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @ApiProperty({ enum: CurrencyEnum, default: CurrencyEnum.USD })
  @IsOptional()
  @IsEnum(CurrencyEnum)
  readonly currency: CurrencyEnum;

  @ApiProperty({ type: Number, default: 0 })
  @IsOptional()
  @IsNumber()
  readonly race: number;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @Matches(
    /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/,
    {
      message: 'Enter correct date format',
    },
  )
  readonly createYear: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({ type: Number, default: 1, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly availableCar: number;

  @ApiProperty({ type: Number, default: 5, minimum: 2 })
  @IsOptional()
  @IsNumber()
  @Min(2)
  readonly seats: number;
}
