import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarEntity } from 'src/car/entity/car.entity';
import { DriveController } from './drive.controller';
import { DriveService } from './drive.service';
import { DriveEntity } from './entity/drive.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DriveEntity])],
  controllers: [DriveController],
  providers: [DriveService],
  exports: [DriveService],
})
export class DriveModule {}
