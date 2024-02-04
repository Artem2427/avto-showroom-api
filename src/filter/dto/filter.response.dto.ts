import { ApiProperty } from '@nestjs/swagger';
import { BodyTypeEntity } from '../../body-type/entity/bodyType.entity';
import { BrandEntity } from '../../brand/entity/brand.entity';
import { ColorEntity } from '../../color/entity/color.entity';
import { FuelEntity } from '../../fuel/entity/fuelType.entity';
import { TransmissionEntity } from '../../transmission/entity/trnasmission.entity';

export class FilterResDTO {
  @ApiProperty({ type: [BodyTypeEntity] })
  bodyTypes: BodyTypeEntity[];

  @ApiProperty({ type: [BrandEntity] })
  brands: BrandEntity[];

  @ApiProperty({ type: [TransmissionEntity] })
  transmissions: TransmissionEntity[];

  @ApiProperty({ type: [FuelEntity] })
  fuels: FuelEntity[];

  @ApiProperty({ type: [ColorEntity] })
  colors: ColorEntity[];

  @ApiProperty({ type: Number })
  maxPrice: number;

  @ApiProperty({ type: Number })
  minPrice: number;

  @ApiProperty({ type: String })
  maxYear: Date;

  @ApiProperty({ type: String })
  minYear: Date;

  @ApiProperty({ type: Number })
  maxRace: number;

  @ApiProperty({ type: Number })
  minRace: number;
}
