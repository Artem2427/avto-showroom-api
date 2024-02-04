import { Injectable } from '@nestjs/common';
import { BodyTypeService } from 'src/body-type/body-type.service';
import { BrandService } from 'src/brand/brand.service';
import { CarService } from 'src/car/car.service';
import { ColorService } from 'src/color/color.service';
import { FuelService } from 'src/fuel/fuel.service';
import { TransmissionService } from 'src/transmission/transmission.service';
import { FilterResDTO } from './dto/filter.response.dto';

@Injectable()
export class FilterService {
  constructor(
    private readonly bodyTypeService: BodyTypeService,
    private readonly colorService: ColorService,
    private readonly transmissionService: TransmissionService,
    private readonly fuelService: FuelService,
    private readonly brandService: BrandService,
    private readonly carService: CarService,
  ) {}

  async getAllFilters(): Promise<FilterResDTO> {
    const bodyTypes = await this.bodyTypeService.findAllWithOutCars();
    const colors = await this.colorService.findAllWithOutCars();
    const transmissions = await this.transmissionService.findAllWithOutCars();
    const fuels = await this.fuelService.findAllWithOutCars();
    const brands = await this.brandService.findAllWithOutCars();

    const carObject = await this.carService.getCarMinAndMaxValues();

    return {
      brands,
      bodyTypes,
      transmissions,
      fuels,
      colors,
      ...carObject,
    };
  }
}
