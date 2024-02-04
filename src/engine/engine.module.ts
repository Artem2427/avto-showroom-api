import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuelModule } from '../fuel/fuel.module';
import { ModelModule } from '../model/model.module';
import { EngineController } from './engine.controller';
import { EngineService } from './engine.service';
import { EngineEntity } from './entity/engine.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EngineEntity]), ModelModule, FuelModule],
  controllers: [EngineController],
  providers: [EngineService],
  exports: [EngineService],
})
export class EngineModule {}
