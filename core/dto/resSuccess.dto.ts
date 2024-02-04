import { ApiProperty } from '@nestjs/swagger';

export class ResSuccessDTO {
  @ApiProperty({ type: Boolean })
  readonly success: boolean;
}
