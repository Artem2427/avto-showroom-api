import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandEntity } from '../brand/entity/brand.entity';
import { ModelEntity } from './entity/model.entity';
import { ModelController } from './model.controller';
import { ModelService } from './model.service';

@Module({
  imports: [TypeOrmModule.forFeature([ModelEntity, BrandEntity])],
  controllers: [ModelController],
  providers: [ModelService],
  exports: [ModelService],
})
export class ModelModule {}
