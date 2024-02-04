import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class ChangeMainImageDTO {
  @ApiProperty({ type: Number, required: true, minimum: 0 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  mainImage: number;
}
