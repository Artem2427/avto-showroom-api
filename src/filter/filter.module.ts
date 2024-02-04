import { Module } from '@nestjs/common';
import { BodyTypeModule } from 'src/body-type/body-type.module';
import { BrandModule } from 'src/brand/brand.module';
import { CarModule } from 'src/car/car.module';
import { ColorModule } from 'src/color/color.module';
import { FuelModule } from 'src/fuel/fuel.module';
import { TransmissionModule } from 'src/transmission/transmission.module';
import { FilterController } from './filter.controller';
import { FilterService } from './filter.service';

@Module({
  imports: [
    BodyTypeModule,
    ColorModule,
    TransmissionModule,
    FuelModule,
    BrandModule,
    CarModule,
  ],
  controllers: [FilterController],
  providers: [FilterService],
})
export class FilterModule {}
