import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BodyTypeModule } from '../body-type/body-type.module';
import { BrandModule } from '../brand/brand.module';
import { ColorModule } from '../color/color.module';
import { DriveModule } from '../drive/drive.module';
import { EngineModule } from '../engine/engine.module';
import { FileModule } from '../file/file.module';
import { ModelModule } from '../model/model.module';
import { PriceModule } from '../price/price.module';
import { TransmissionModule } from '../transmission/transmission.module';
import { CarController } from './car.controller';
import { CarService } from './car.service';
import { CarEntity } from './entity/car.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CarEntity]),
    ModelModule,
    BrandModule,
    DriveModule,
    BodyTypeModule,
    ColorModule,
    TransmissionModule,
    EngineModule,
    forwardRef(() => PriceModule),
    FileModule,
  ],
  controllers: [CarController],
  providers: [CarService],
  exports: [CarService],
})
export class CarModule {}
