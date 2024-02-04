import { Module } from '@nestjs/common';
import { TransmissionService } from './transmission.service';
import { TransmissionController } from './transmission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransmissionEntity } from './entity/trnasmission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TransmissionEntity])],
  providers: [TransmissionService],
  controllers: [TransmissionController],
  exports: [TransmissionService],
})
export class TransmissionModule {}
