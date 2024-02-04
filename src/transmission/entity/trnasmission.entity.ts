import { ApiProperty } from '@nestjs/swagger';
import { TransmissionEnum } from '../../../core/enums/transmission.enum';
import { CarEntity } from 'src/car/entity/car.entity';
// import { BaseEntity } from 'src/core/entities/base.entity';
// import { TransmissionEnum } from 'src/core/enums/transmission.enum';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'transmissions' })
export class TransmissionEntity {
  @ApiProperty({ type: String })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: String })
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({ type: String })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ApiProperty({ enum: TransmissionEnum })
  @Column({ type: 'varchar', length: '100' })
  transmission: TransmissionEnum;

  @ApiProperty({ type: () => [CarEntity], required: false })
  @OneToMany(() => CarEntity, (car) => car.transmission)
  cars: CarEntity[];
}
