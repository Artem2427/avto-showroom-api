import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, MaxLength } from 'class-validator';

export class CreateFeedbackDTO {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @MaxLength(20)
  @IsNumberString()
  readonly phone: string;

  @ApiProperty({ type: String, maxLength: 4000 })
  @IsNotEmpty()
  @MaxLength(4000)
  readonly comment: string;

  @ApiProperty({ type: String, maxLength: 200 })
  @IsNotEmpty()
  @MaxLength(200)
  readonly name: string;
}
