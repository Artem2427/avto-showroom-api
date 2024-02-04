import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BodyTypeController } from './body-type.controller';
import { BodyTypeService } from './body-type.service';
import { BodyTypeEntity } from './entity/bodyType.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BodyTypeEntity])],
  controllers: [BodyTypeController],
  providers: [BodyTypeService],
  exports: [BodyTypeService],
})
export class BodyTypeModule {}
