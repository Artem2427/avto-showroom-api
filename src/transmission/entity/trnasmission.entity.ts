import { ApiProperty } from '@nestjs/swagger';
import { CarEntity } from 'src/car/entity/car.entity';
import { BaseEntity } from 'src/core/entities/base.entity';
import { TransmissionEnum } from 'src/core/enums/transmission.enum';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'transmissions' })
export class TransmissionEntity extends BaseEntity {
  @ApiProperty({ enum: TransmissionEnum })
  @Column({ type: 'varchar', length: '100' })
  transmission: TransmissionEnum;

  @ApiProperty({ type: () => [CarEntity], required: false })
  @OneToMany(() => CarEntity, (car) => car.transmission)
  cars: CarEntity[];
}
