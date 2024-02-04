import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BrandUpdateDTO } from './brandUpdate.dto';

export class BrandCreateDTO extends BrandUpdateDTO {
  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  readonly models?: string[];
}
