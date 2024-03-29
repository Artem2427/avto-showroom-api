import { ApiProperty } from '@nestjs/swagger';
import { BodyTypeEnum } from '../../../core/enums/bodyType.enum';
import { CarEntity } from '../../car/entity/car.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'bodyTypes' })
export class BodyTypeEntity {
  @ApiProperty({ type: String })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: String })
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({ type: String })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
  @ApiProperty({ enum: BodyTypeEnum })
  @Column({ type: 'varchar', nullable: false, unique: true })
  body: BodyTypeEnum;

  @ApiProperty({ type: String })
  @Column({ type: 'varchar', nullable: true })
  icon: string;

  @ApiProperty({ type: () => [CarEntity], required: false })
  @OneToMany(() => CarEntity, (car) => car.bodyType)
  cars: CarEntity[];
}
