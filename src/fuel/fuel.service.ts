import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFuelDTO } from './dto/createFuel.dto';
import { FuelEntity } from './entity/fuelType.entity';

@Injectable()
export class FuelService {
  constructor(
    @InjectRepository(FuelEntity)
    private readonly fuelRepository: Repository<FuelEntity>,
  ) {}

  async findOneById(fuelId: string, relations: string[] = []) {
    const fuel = await this.fuelRepository.findOne({
      where: { id: fuelId },
      relations,
    });

    if (!fuel) {
      throw new NotFoundException('Fuel not found');
    }

    return fuel;
  }

  async findAllWithOutCars(): Promise<FuelEntity[]> {
    return await this.fuelRepository.find({ order: { fuelType: 'ASC' } });
  }

  async createOne(createFuelDTO: CreateFuelDTO) {
    const fuel = await this.fuelRepository.findOne({
      where: { fuelType: createFuelDTO.fuelType },
    });

    if (fuel) {
      throw new BadRequestException('This fuel is already created');
    }

    const newFuel = new FuelEntity();
    newFuel.fuelType = createFuelDTO.fuelType;

    await this.fuelRepository.save(newFuel);

    return { success: true };
  }
}
