import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'core/entities/base.entity';
import { CarEntity } from 'src/car/entity/car.entity';
// import { BaseEntity } from 'src/core/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'colors' })
export class ColorEntity extends BaseEntity {
  @ApiProperty({ type: String, maxLength: 100 })
  @Column({ type: 'varchar', length: '100', unique: true })
  color: string;

  @ApiProperty({
    type: String,
    maxLength: 7,
    examples: [{ hex: '#fff' }, { hex: '#000000' }],
  })
  @Column({ type: 'varchar', length: '7', unique: true })
  hex: string;

  @ApiProperty({ type: () => [CarEntity], required: false })
  @OneToMany(() => CarEntity, (car) => car.color)
  cars: CarEntity[];
}
