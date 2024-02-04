import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransmissionDTO } from './dto/createTransmisson.dto';
import { TransmissionEntity } from './entity/trnasmission.entity';

@Injectable()
export class TransmissionService {
  constructor(
    @InjectRepository(TransmissionEntity)
    private readonly transmissionRepository: Repository<TransmissionEntity>,
  ) {}

  async findOneById(transmissionId: string) {
    const drive = await this.transmissionRepository.findOne({
      where: { id: transmissionId },
    });

    if (!drive) {
      throw new NotFoundException('Drive not found');
    }

    return drive;
  }

  async findAllWithOutCars(): Promise<TransmissionEntity[]> {
    return await this.transmissionRepository.find({
      order: { transmission: 'ASC' },
    });
  }

  async createOne(createTransmissionDTO: CreateTransmissionDTO) {
    const transmission = await this.transmissionRepository.findOne({
      where: { transmission: createTransmissionDTO.transmission },
    });

    if (transmission) {
      throw new BadRequestException('Transmission is already created');
    }

    const newTransmission = new TransmissionEntity();
    newTransmission.transmission = createTransmissionDTO.transmission;
    await this.transmissionRepository.save(newTransmission);

    return { success: true };
  }
}
