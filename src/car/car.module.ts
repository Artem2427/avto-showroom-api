import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BodyTypeModule } from 'src/body-type/body-type.module';
import { BrandModule } from 'src/brand/brand.module';
import { ColorModule } from 'src/color/color.module';
import { DriveModule } from 'src/drive/drive.module';
import { EngineModule } from 'src/engine/engine.module';
import { FileModule } from 'src/file/file.module';
import { ModelModule } from 'src/model/model.module';
import { PriceModule } from 'src/price/price.module';
import { TransmissionModule } from 'src/transmission/transmission.module';
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
