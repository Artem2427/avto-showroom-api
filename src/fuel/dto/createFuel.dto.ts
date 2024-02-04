import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { FuelEnum } from '../../../core/enums/fuel.enum';
// import { FuelEnum } from 'src/core/enums/fuel.enum';

export class CreateFuelDTO {
  @ApiProperty({ enum: FuelEnum, required: true })
  @IsNotEmpty()
  @IsEnum(FuelEnum)
  fuelType: FuelEnum;
}
