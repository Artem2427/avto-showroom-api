import { ApiProperty } from '@nestjs/swagger';
import { CarEntity } from 'src/car/entity/car.entity';
import { BaseEntity } from 'src/core/entities/base.entity';
import { BodyTypeEnum } from 'src/core/enums/bodyType.enum';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'bodyTypes' })
export class BodyTypeEntity extends BaseEntity {
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
