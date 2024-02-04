import { Module } from '@nestjs/common';
import { BodyTypeModule } from '../body-type/body-type.module';
import { BrandModule } from '../brand/brand.module';
import { CarModule } from '../car/car.module';
import { ColorModule } from '../color/color.module';
import { FuelModule } from '../fuel/fuel.module';
import { TransmissionModule } from '../transmission/transmission.module';
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
