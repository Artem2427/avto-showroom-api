import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { TransmissionEnum } from '../../../core/enums/transmission.enum';
// import { TransmissionEnum } from 'src/core/enums/transmission.enum';

export class CreateTransmissionDTO {
  @ApiProperty({ enum: TransmissionEnum })
  @IsNotEmpty()
  @IsEnum(TransmissionEnum)
  readonly transmission: TransmissionEnum;
}
