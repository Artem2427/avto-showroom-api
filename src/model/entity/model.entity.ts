import { ApiProperty } from '@nestjs/swagger';
import { BrandEntity } from 'src/brand/entity/brand.entity';
import { CarEntity } from 'src/car/entity/car.entity';
import { BaseEntity } from 'src/core/entities/base.entity';
import { EngineEntity } from 'src/engine/entity/engine.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'models' })
export class ModelEntity extends BaseEntity {
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
