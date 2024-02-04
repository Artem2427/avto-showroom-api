import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'core/entities/base.entity';
import { DriveEnum } from 'core/enums/drive.enum';
import { CarEntity } from 'src/car/entity/car.entity';
// import { BaseEntity } from 'src/core/entities/base.entity';
// import { DriveEnum } from 'src/core/enums/drive.enum';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'drives' })
export class DriveEntity extends BaseEntity {
  @ApiProperty({ enum: DriveEnum })
  @Column({ type: 'varchar', length: '100', unique: true, nullable: false })
  typeOfDrive: DriveEnum;

  @ApiProperty({ type: () => [CarEntity], isArray: true })
  @OneToMany(() => CarEntity, (car) => car.drive)
  cars: CarEntity[];
}
