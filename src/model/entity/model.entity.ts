import { ApiProperty } from '@nestjs/swagger';
import { BrandEntity } from '../../brand/entity/brand.entity';
import { CarEntity } from '../../car/entity/car.entity';
import { EngineEntity } from '../../engine/entity/engine.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'models' })
export class ModelEntity {
  @ApiProperty({ type: String })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: String })
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({ type: String })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ApiProperty({ type: String, maxLength: 200 })
  @Column({ type: 'varchar', length: '200', unique: true })
  name: string;

  @ApiProperty({ type: String })
  @Column({ type: 'varchar' })
  brandId: string;

  @ApiProperty({ type: () => BrandEntity, required: false })
  @ManyToOne(() => BrandEntity, (brand) => brand.models, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  brand: BrandEntity;

  @ApiProperty({ type: () => [CarEntity], required: false })
  @OneToMany(() => CarEntity, (car) => car.model)
  cars: CarEntity[];

  @ApiProperty({ type: () => [EngineEntity], required: false })
  @OneToMany(() => EngineEntity, (engine) => engine.model)
  engines: EngineEntity[];
}
