import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'core/entities/base.entity';
import { FuelEnum } from 'core/enums/fuel.enum';
// import { BaseEntity } from 'src/core/entities/base.entity';
// import { FuelEnum } from 'src/core/enums/fuel.enum';
import { EngineEntity } from 'src/engine/entity/engine.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'fuels' })
export class FuelEntity extends BaseEntity {
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
