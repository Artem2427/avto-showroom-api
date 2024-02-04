import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'core/entities/base.entity';
import { CarEntity } from 'src/car/entity/car.entity';
// import { BaseEntity } from 'src/core/entities/base.entity';
import { ModelEntity } from 'src/model/entity/model.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'brands' })
export class BrandEntity extends BaseEntity {
  @ApiProperty({ type: String, maxLength: 20 })
  @Column({ type: 'varchar', length: '20', unique: true })
  phone: string;

  @ApiProperty({ type: String, maxLength: 200 })
  @Column({ type: 'varchar', length: '200', unique: true })
  name: string;

  @ApiProperty({ type: String })
  @Column({ nullable: true })
  logo: string;

  @ApiProperty({ type: () => [CarEntity], required: false })
  @OneToMany(() => CarEntity, (car) => car.brand)
  cars: CarEntity[];

  @ApiProperty({ type: () => [ModelEntity], required: false })
  @OneToMany(() => ModelEntity, (model) => model.brand)
  models: ModelEntity[];
}
