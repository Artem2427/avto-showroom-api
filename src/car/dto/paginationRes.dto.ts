import { ApiProperty } from '@nestjs/swagger';
import { CarEntity } from '../entity/car.entity';

export class PaginationResDTO {
  @ApiProperty({ type: () => [CarEntity] })
  readonly cars: CarEntity[];

  @ApiProperty({ type: Number })
  readonly totalAmount: number;
}
