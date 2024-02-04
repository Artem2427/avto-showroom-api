import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class AddCarImageDTO {
  @ApiProperty({ type: String, format: 'binary', required: false })
  @IsOptional()
  file?: Express.Multer.File;
}
