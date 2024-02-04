import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/core/entities/base.entity';
import { CurrencyEnum } from 'src/core/enums/currency.enum';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'prices' })
export class PriceEntity extends BaseEntity {
  @ApiProperty({ type: Number })
  @Column({ type: 'real', default: 1 })
  USD: number;

  @ApiProperty({ type: Number })
  @Column({ type: 'real' })
  EUR: number;

  @ApiProperty({ type: Number })
  @Column({ type: 'real' })
  UAH: number;

  @ApiProperty({ type: Number })
  @Column({ type: 'real' })
  BTC: number;

  @ApiProperty({ enum: CurrencyEnum })
  @Column({ type: 'enum', enum: CurrencyEnum, default: CurrencyEnum.UAH })
  currentCurrency: CurrencyEnum;
}
