import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { DriveEnum } from '../../../core/enums/drive.enum';

export class CreateDriveDTO {
  @ApiProperty({ enum: DriveEnum, required: true })
  @IsNotEmpty()
  @IsEnum(DriveEnum)
  readonly typeOfDrive: DriveEnum;
}
