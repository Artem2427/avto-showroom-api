import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { CurrencyEnum } from '../../../core/enums/currency.enum';
// import { CurrencyEnum } from 'src/core/enums/currency.enum';

export class ChangeCurrencyDTO {
  @ApiProperty({ enum: CurrencyEnum })
  @IsNotEmpty()
  @IsEnum(CurrencyEnum)
  readonly currency: CurrencyEnum;
}
