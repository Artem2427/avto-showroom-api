import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CreateColorDTO {
  @ApiProperty({ type: String, nullable: false })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  readonly color: string;

  @ApiProperty({ type: String, nullable: false })
  @IsNotEmpty()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'Enter correct hex',
  })
  readonly hex: string;
}
