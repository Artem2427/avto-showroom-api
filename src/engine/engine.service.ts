import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FuelService } from '../fuel/fuel.service';
import { ModelService } from '../model/model.service';
import { Repository } from 'typeorm';
import { CreateEngineDTO } from './dto/createEngine.dto';
import { UpdateEngineDTO } from './dto/updateEngine.dto';
import { EngineEntity } from './entity/engine.entity';
import { FuelEnum } from '../../core/enums/fuel.enum';

@Injectable()
export class EngineService {
  constructor(
    @InjectRepository(EngineEntity)
    private readonly engineRepository: Repository<EngineEntity>,

    private readonly modelService: ModelService,
    private readonly fuelService: FuelService,
  ) {}

  async findOneByModel(engineId: string, modelId: string) {
    const engine = await this.engineRepository
      .createQueryBuilder('engine')
      .where('engine.id = :engineId AND engine.modelId = :modelId', {
        engineId,
        modelId,
      })
      .getOne();

    if (!engine) {
      throw new BadRequestException('Engine not found');
    }

    return engine;
  }

  async findOneById(transmissionId: string, relations: string[] = []) {
    const engine = await this.engineRepository.findOne({
      where: { id: transmissionId },
      relations,
    });

    if (!engine) {
      throw new NotFoundException('Drive not found');
    }

    return engine;
  }

  async findAllByModelWithOutCars(modelId: string): Promise<EngineEntity[]> {
    return await this.engineRepository.find({ where: { modelId } });
  }

  async createOne(createEngineDTO: CreateEngineDTO) {
    const { modelId, fuelId, ...createDTO } = createEngineDTO;

    const engine = await this.engineRepository.findOne({
      where: { modelName: createDTO.modelName, modelId },
    });

    if (engine) {
      throw new BadRequestException('Engine is already created');
    }

    const model = await this.modelService.findOneById(modelId);
    const fuel = await this.fuelService.findOneById(fuelId);

    const newEngine = new EngineEntity();
    Object.assign(newEngine, createDTO);

    newEngine.model = model;
    newEngine.modelId = modelId;
    newEngine.fuel = fuel;
    newEngine.isElectro = FuelEnum.Electro === fuel.fuelType;
    await this.engineRepository.save(newEngine);

    return { success: true };
  }

  async updateOne(engineId: string, updateEngineDTO: UpdateEngineDTO) {
    const updateEngine = await this.findOneById(engineId);

    const equalEngine = await this.engineRepository
      .createQueryBuilder('engine')
      .where('engine.id <> :engineId AND engine.modelName = :modelName', {
        engineId,
        modelName: updateEngineDTO.modelName,
      })
      .getOne();

    if (equalEngine) {
      throw new BadRequestException('Model name is already used');
    }

    Object.assign(updateEngine, updateEngineDTO);
    updateEngine.updatedAt = new Date();

    await this.engineRepository.save(updateEngine);

    return { success: true };
  }

  async removeOne(engineId: string) {
    const engine = await this.findOneById(engineId, ['cars']);

    if (engine.cars.length) {
      throw new BadRequestException('Engine is used in some cars');
    }

    await this.engineRepository.remove(engine);

    return {
      success: true,
    };
  }
}
