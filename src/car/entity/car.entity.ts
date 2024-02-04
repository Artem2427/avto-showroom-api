import { ApiProperty } from '@nestjs/swagger';
// import { BaseEntity } from 'core/entities/base.entity';
import { CurrencyEnum } from 'core/enums/currency.enum';
import { BodyTypeEntity } from 'src/body-type/entity/bodyType.entity';
import { BrandEntity } from 'src/brand/entity/brand.entity';
import { ColorEntity } from 'src/color/entity/color.entity';
// import { BaseEntity } from 'src/core/entities/base.entity';
// import { CurrencyEnum } from 'src/core/enums/currency.enum';
import { DriveEntity } from 'src/drive/entity/drive.entity';
import { EngineEntity } from 'src/engine/entity/engine.entity';
import { ModelEntity } from 'src/model/entity/model.entity';
import { TransmissionEntity } from 'src/transmission/entity/trnasmission.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'cars' })
export class CarEntity {
  @ApiProperty({ type: String })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: String })
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({ type: String })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ApiProperty({ type: Number, name: 'price' })
  @Column({ type: 'real' })
  price: number;

  @ApiProperty({ enum: CurrencyEnum, isArray: false })
  @Column({ type: 'enum', enum: CurrencyEnum, default: CurrencyEnum.USD })
  currency: CurrencyEnum;

  @ApiProperty({ type: String, name: 'name' })
  @Column({ type: 'varchar', length: '1000' })
  name: string;

  @ApiProperty({ type: Number, name: 'race', maximum: 100000 })
  @Column({ nullable: false, default: 0 })
  race: number;

  @ApiProperty({ type: Date, name: 'createYear' })
  @Column({ nullable: false })
  createYear: Date;

  @ApiProperty({ type: Number, name: 'availableCar' })
  @Column({ nullable: false, default: 1 })
  availableCar: number;

  @ApiProperty({ type: Boolean, name: 'inStock' })
  @Column({ nullable: false, default: true })
  inStock: boolean;

  @ApiProperty({ type: [String], name: 'images' })
  @Column({ type: String, array: true, default: [] })
  images: string[];

  @ApiProperty({ type: Number, name: 'mainImage' })
  @Column({ nullable: false, default: 1 })
  mainImage: number;

  @ApiProperty({ type: Number, name: 'seats' })
  @Column({ nullable: false, default: 5 })
  seats: number;

  @ApiProperty({ type: () => BrandEntity, required: false })
  @ManyToOne(() => BrandEntity, (brand) => brand.cars, { onDelete: 'CASCADE' })
  brand: BrandEntity;

  @ApiProperty({ type: () => ModelEntity, required: false })
  @ManyToOne(() => ModelEntity, (model) => model.cars, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  model: ModelEntity;

  @ApiProperty({ type: () => DriveEntity, required: false })
  @ManyToOne(() => DriveEntity, (drive) => drive.cars, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  drive: DriveEntity;

  @ApiProperty({ type: () => BodyTypeEntity, required: false })
  @ManyToOne(() => BodyTypeEntity, (bodyType) => bodyType.cars, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  bodyType: BodyTypeEntity;

  @ApiProperty({ type: () => ColorEntity, required: false })
  @ManyToOne(() => ColorEntity, (color) => color.cars, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  color: ColorEntity;

  @ApiProperty({ type: () => EngineEntity, required: false })
  @ManyToOne(() => EngineEntity, (engine) => engine.cars, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  engine: EngineEntity;

  @ApiProperty({ type: () => TransmissionEntity, required: false })
  @ManyToOne(() => TransmissionEntity, (transmission) => transmission.cars, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  transmission: TransmissionEntity;
}
