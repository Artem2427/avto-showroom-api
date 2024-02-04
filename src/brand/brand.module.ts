import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarEntity } from '../car/entity/car.entity';
import { FileModule } from '../file/file.module';
import { ModelEntity } from '../model/entity/model.entity';
import { ModelModule } from '../model/model.module';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { BrandEntity } from './entity/brand.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BrandEntity, ModelEntity, CarEntity]),
    ModelModule,
    FileModule,
  ],

  controllers: [BrandController],
  providers: [BrandService],
  exports: [BrandService],
})
export class BrandModule {}
