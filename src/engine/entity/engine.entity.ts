import { ApiProperty } from '@nestjs/swagger';
import { CarEntity } from 'src/car/entity/car.entity';
// import { BaseEntity } from 'src/core/entities/base.entity';
import { FuelEntity } from 'src/fuel/entity/fuelType.entity';
import { ModelEntity } from 'src/model/entity/model.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'engines' })
export class EngineEntity {
  @ApiProperty({ type: String })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: String })
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({ type: String })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ApiProperty({ type: Number, nullable: false })
  @Column({ type: 'float', nullable: false })
  volume: number;

  @ApiProperty({ type: Number, nullable: false })
  @Column({ type: 'integer', nullable: false })
  capacity: number;

  @ApiProperty({ type: String, maxLength: 50, nullable: false })
  @Column({ type: 'varchar', length: '50', nullable: false })
  modelName: string;

  @ApiProperty({ type: Boolean })
  @Column({ type: 'boolean' })
  isElectro: boolean;

  @ApiProperty({ type: Number, nullable: true })
  @Column({ type: 'float', nullable: true })
  wasteCity: number;

  @ApiProperty({ type: Number, nullable: true })
  @Column({ type: 'float', nullable: true })
  wasteOutOfCity: number;

  @ApiProperty({ type: Number, nullable: true })
  @Column({ type: 'float', nullable: true })
  averageConsumption: number;

  @ApiProperty({ type: () => FuelEntity, required: false })
  @ManyToOne(() => FuelEntity, (fuel) => fuel.engines, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  fuel: FuelEntity;

  @ApiProperty({ type: () => [CarEntity], required: false })
  @OneToMany(() => CarEntity, (car) => car.engine)
  cars: CarEntity[];

  @ApiProperty({ type: String })
  @Column({ type: 'varchar' })
  modelId: string;

  @ApiProperty({ type: () => ModelEntity, required: false })
  @ManyToOne(() => ModelEntity, (model) => model.engines, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  model: ModelEntity;
}
