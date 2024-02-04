import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsBooleanString, IsNotEmpty } from 'class-validator';

export class UpdateStatusFeedbackDTO {
  @ApiProperty({ type: Boolean })
  @IsNotEmpty()
  @IsBooleanString()
  readonly isCall: boolean;
}
