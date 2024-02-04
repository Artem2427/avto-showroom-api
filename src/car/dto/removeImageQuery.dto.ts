import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RemoveImageQueryDTO {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  imageUrl: string;
}
