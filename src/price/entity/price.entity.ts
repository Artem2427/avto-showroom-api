import { ApiProperty } from '@nestjs/swagger';
// import { BaseEntity } from 'core/entities/base.entity';
import { CurrencyEnum } from 'core/enums/currency.enum';
// import { BaseEntity } from 'src/core/entities/base.entity';
// import { CurrencyEnum } from 'src/core/enums/currency.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'prices' })
export class PriceEntity {
  @ApiProperty({ type: String })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: String })
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({ type: String })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;


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
