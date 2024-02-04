import { ApiProperty } from '@nestjs/swagger';
import { FuelEnum } from '../../../core/enums/fuel.enum';
// import { BaseEntity } from 'src/core/entities/base.entity';
// import { FuelEnum } from 'src/core/enums/fuel.enum';
import { EngineEntity } from 'src/engine/entity/engine.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'fuels' })
export class FuelEntity {
  @ApiProperty({ type: String })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: String })
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({ type: String })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ApiProperty({ enum: FuelEnum })
  @Column({
    type: 'varchar',
    length: '100',
    unique: true,
    nullable: false,
  })
  fuelType: FuelEnum;

  @ApiProperty({ type: () => [EngineEntity] })
  @OneToMany(() => EngineEntity, (engine) => engine.fuel)
  engines: EngineEntity[];
}
