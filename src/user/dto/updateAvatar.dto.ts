import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateAvatarDTO {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  @IsOptional()
  file?: Express.Multer.File;
}
