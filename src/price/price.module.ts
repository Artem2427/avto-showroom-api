import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceEntity } from './entity/price.entity';
import { PriceService } from './price.service';
import { PriceController } from './price.controller';
import { HttpModule } from '@nestjs/axios';
import { CarModule } from 'src/car/car.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PriceEntity]),
    HttpModule,
    forwardRef(() => CarModule),
  ],
  providers: [PriceService],
  exports: [PriceService],
  controllers: [PriceController],
})
export class PriceModule {}
