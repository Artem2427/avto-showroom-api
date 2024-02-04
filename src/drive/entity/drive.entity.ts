import { ApiProperty } from '@nestjs/swagger';
import { DriveEnum } from '../../../core/enums/drive.enum';
import { CarEntity } from '../../car/entity/car.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'drives' })
export class DriveEntity {
  @ApiProperty({ type: String })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: String })
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({ type: String })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ApiProperty({ enum: DriveEnum })
  @Column({ type: 'varchar', length: '100', unique: true, nullable: false })
  typeOfDrive: DriveEnum;

  @ApiProperty({ type: () => [CarEntity], isArray: true })
  @OneToMany(() => CarEntity, (car) => car.drive)
  cars: CarEntity[];
}
