import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBodyTypeDTO } from './dto/createBodyType.dto';
import { BodyTypeEntity } from './entity/bodyType.entity';

@Injectable()
export class BodyTypeService {
  constructor(
    @InjectRepository(BodyTypeEntity)
    private readonly bodyTypeRepository: Repository<BodyTypeEntity>,
  ) {}

  async findOneById(fuelId: string) {
    const bodyType = await this.bodyTypeRepository.findOne({
      where: { id: fuelId },
    });

    if (!bodyType) {
      throw new NotFoundException('BodyType not found');
    }

    return bodyType;
  }

  async findAllWithOutCars(): Promise<BodyTypeEntity[]> {
    return await this.bodyTypeRepository.find({ order: { createdAt: 'DESC' } });
  }

  async createOne(createColorDTO: CreateBodyTypeDTO) {
    const bodyType = await this.bodyTypeRepository.findOne({
      where: { body: createColorDTO.body },
    });

    if (bodyType) {
      throw new BadRequestException('This fuel is already created');
    }

    const newBodyType = new BodyTypeEntity();
    Object.assign(newBodyType, createColorDTO);

    await this.bodyTypeRepository.save(newBodyType);

    return { success: true };
  }

  async deleteOne(id: string) {
    const body = await this.bodyTypeRepository.findOne({ where: { id } });

    await this.bodyTypeRepository.remove(body);

    return { success: true };
  }
}
