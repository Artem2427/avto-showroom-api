import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDriveDTO } from './dto/createDrive.dto';
import { DriveEntity } from './entity/drive.entity';

@Injectable()
export class DriveService {
  constructor(
    @InjectRepository(DriveEntity)
    private readonly driveRepository: Repository<DriveEntity>,
  ) {}

  async findOneById(driveId: string) {
    const drive = await this.driveRepository.findOne({
      where: { id: driveId },
    });

    if (!drive) {
      throw new NotFoundException('Drive not found');
    }

    return drive;
  }

  async findAllWithOutCars(): Promise<DriveEntity[]> {
    return await this.driveRepository.find();
  }

  async createOne(createDriveDTO: CreateDriveDTO) {
    const drive = await this.driveRepository.findOne({
      where: { typeOfDrive: createDriveDTO.typeOfDrive },
    });

    if (drive) {
      throw new BadRequestException('This drive is already created');
    }

    const newDrive = new DriveEntity();
    newDrive.typeOfDrive = createDriveDTO.typeOfDrive;
    await this.driveRepository.save(newDrive);

    return { success: true };
  }
}
