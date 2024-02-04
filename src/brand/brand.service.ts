import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { PaginationQueryDTO } from 'src/core/dto/pagination.query.dto';
import { FileService } from 'src/file/file.service';
import { API_URL } from 'src/file/fileConstants';
import { ModelEntity } from 'src/model/entity/model.entity';
import { ModelService } from 'src/model/model.service';
import { Repository } from 'typeorm';
import { BrandCreateDTO } from './dto/brandCreate.dto';
import { BrandUpdateDTO } from './dto/brandUpdate.dto';
import { BrandEntity } from './entity/brand.entity';
import { PaginationQueryDTO } from '../../core/dto/pagination.query.dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(BrandEntity)
    private readonly brandRepository: Repository<BrandEntity>,

    private readonly fileService: FileService,
    private readonly modelService: ModelService,
  ) {}

  async findOneById(brandId: string, relations: string[] = []) {
    const brand = await this.brandRepository.findOne({
      where: { id: brandId },
      relations,
    });

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    return brand;
  }

  async findAllWithOutCars(): Promise<BrandEntity[]> {
    return await this.brandRepository
      .createQueryBuilder('brand')
      .orderBy('brand.name', 'ASC')
      .getMany();
  }

  async findAllForAdmin(paginationQuery: PaginationQueryDTO) {
    const { page, pageSize, searchTerm } = paginationQuery;
    const take = pageSize || 30;
    const skip = (page - 1) * take;

    const queryBuilder = this.brandRepository
      .createQueryBuilder('brands')
      .orderBy('brands.createdAt', 'DESC');

    if (searchTerm) {
      queryBuilder.where('brands.name ILIKE :search', {
        search: `%${searchTerm}%`,
      });
    }

    const totalAmount = await queryBuilder.getCount();

    queryBuilder.take(take);
    queryBuilder.skip(skip);

    const brands = await queryBuilder.getMany();

    return {
      brands,
      total: totalAmount,
    };
  }

  async createOne(brandCreateDto: BrandCreateDTO, file: Express.Multer.File) {
    const { name, phone, models } = brandCreateDto;
    const brandByName = await this.brandRepository
      .createQueryBuilder('brand')
      .where('brand.name = :name', { name })
      .orWhere('brand.phone = :phone', { phone })
      .getOne();

    if (brandByName) {
      throw new HttpException(
        'This brand or phone is already used',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newBrand = new BrandEntity();
    Object.assign(newBrand, { name, phone });

    if (file) {
      const logo = await this.fileService.uploadImageFile(file, API_URL.upload);
      newBrand.logo = logo;
    } else {
      newBrand.logo = null;
    }

    const brand = await this.brandRepository.save(newBrand);

    if (models.length) {
      await this.modelService.createModels(models, brand.id);
    }

    return {
      success: true,
    };
  }

  async updateOne(
    brandId: string,
    brandUpdateDto: BrandUpdateDTO,
    file: Express.Multer.File,
  ) {
    const brand = await this.findOneById(brandId);

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    const equalBrand = await this.brandRepository
      .createQueryBuilder('brand')
      .where(
        'brand.id <> :brandId AND (brand.name = :name OR brand.phone = :phone)',
        { brandId, name: brandUpdateDto.name, phone: brandUpdateDto.phone },
      )
      .getOne();

    if (equalBrand) {
      throw new BadRequestException('Name or phone is already used');
    }

    Object.assign(brand, brandUpdateDto);
    brand.updatedAt = new Date();

    if (file) {
      brand.logo = await this.fileService.uploadImageFile(file, API_URL.upload);
    }

    await this.brandRepository.save(brand);

    return {
      success: true,
    };
  }

  async deleteOne(id: string) {
    const brand = await this.brandRepository.findOne({ where: { id } });

    if (!brand) {
      throw new HttpException('Brand is not found', HttpStatus.NOT_FOUND);
    }

    await this.brandRepository.remove(brand);

    return {
      success: true,
    };
  }
}
