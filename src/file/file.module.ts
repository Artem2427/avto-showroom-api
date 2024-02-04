import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileService } from './file.service';

@Module({
  imports: [HttpModule],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
