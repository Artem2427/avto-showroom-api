import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandEntity } from '../brand/entity/brand.entity';
import { Repository } from 'typeorm';
import { CreateModelDTO } from './dto/createModel.dto';
import { ModelEntity } from './entity/model.entity';

@Injectable()
export class ModelService {
  constructor(
    @InjectRepository(ModelEntity)
    private readonly modelRepository: Repository<ModelEntity>,
    @InjectRepository(BrandEntity)
    private readonly brandRepository: Repository<BrandEntity>,
  ) {}

  async findAllByBrandWithOutCars(brandId: string): Promise<ModelEntity[]> {
    return await this.modelRepository
      .createQueryBuilder('model')
      .where('model.brandId = :brandId', { brandId })
      .getMany();
  }

  async createModels(models: string[], brandId: string) {
    const findBrand = await this.brandRepository.findOne({
      where: { id: brandId },
    });

    if (!findBrand) {
      throw new HttpException('Not found brand', HttpStatus.BAD_REQUEST);
    }

    let createdModel = 0;

    for (let i = 0; i < models.length; i++) {
      const model = await this.modelRepository.findOne({
        where: { name: models[i] },
      });

      if (model) {
        continue;
      }

      const newModel = new ModelEntity();
      newModel.name = models[i];
      newModel.brandId = findBrand.id;
      newModel.brand = findBrand;

      await this.modelRepository.save(newModel);
      createdModel++;
    }

    return {
      createdModel,
    };
  }

  async createOne(brandId: string, createModelDTO: CreateModelDTO) {
    const brand = await this.brandRepository.findOne({
      where: { id: brandId },
    });

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    const model = await this.modelRepository.findOne({
      where: { name: createModelDTO.name },
    });

    if (model) {
      throw new BadRequestException('Model is already created');
    }

    const newModel = new ModelEntity();
    newModel.name = createModelDTO.name;
    newModel.brandId = brandId;
    newModel.brand = brand;

    await this.modelRepository.save(newModel);

    return {
      success: true,
    };
  }

  async updateOne(modelId: string, createModelDTO: CreateModelDTO) {
    const model = await this.modelRepository.findOne({
      where: { id: modelId },
    });

    if (!model) {
      throw new NotFoundException('Model not found');
    }

    const equalModelByName = await this.modelRepository.findOne({
      where: { name: createModelDTO.name },
    });

    if (equalModelByName) {
      throw new BadRequestException(
        `Model with <${createModelDTO.name}> name is already used`,
      );
    }

    model.name = createModelDTO.name;
    model.updatedAt = new Date();
    await this.modelRepository.save(model);

    return { success: true };
  }

  async findOneByBrand(modelId: string, brandId: string) {
    const model = await this.modelRepository
      .createQueryBuilder('model')
      .where('model.id = :modelId AND model.brandId = :brandId', {
        modelId,
        brandId,
      })
      .getOne();

    if (!model) {
      throw new BadRequestException('Model not found');
    }

    return model;
  }

  async findOneById(modelId: string, relations: string[] = []) {
    const model = await this.modelRepository.findOne({
      where: { id: modelId },
      relations,
    });

    if (!model) {
      throw new BadRequestException('Model not found');
    }

    return model;
  }

  async removeOne(modelId: string) {
    const model = await this.findOneById(modelId, ['cars']);

    if (model.cars.length) {
      throw new BadRequestException('Model is used in some cars');
    }

    await this.modelRepository.remove(model);

    return {
      success: true,
    };
  }
}
