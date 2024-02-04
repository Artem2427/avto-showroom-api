import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { PaginationQueryDTO } from 'src/core/dto/pagination.query.dto';
import { Repository } from 'typeorm';
import { CreateColorDTO } from './dto/createColor.dto';
import { ColorEntity } from './entity/color.entity';
import { PaginationQueryDTO } from 'core/dto/pagination.query.dto';

@Injectable()
export class ColorService {
  constructor(
    @InjectRepository(ColorEntity)
    private readonly colorEntity: Repository<ColorEntity>,
  ) {}

  async findOneById(colorId: string, relations: string[] = []) {
    const color = await this.colorEntity.findOne({
      where: { id: colorId },
      relations,
    });

    if (!color) {
      throw new NotFoundException('Color not found');
    }

    return color;
  }

  async findAllWithOutCars(): Promise<ColorEntity[]> {
    return await this.colorEntity
      .createQueryBuilder('colors')
      .orderBy('colors.color', 'ASC')
      .getMany();
  }

  async findAllForAdmin(paginationQuery: PaginationQueryDTO) {
    const { page, pageSize, searchTerm } = paginationQuery;
    const take = pageSize || 30;
    const skip = (page - 1) * take;

    const queryBuilder = this.colorEntity
      .createQueryBuilder('colors')
      .orderBy('colors.createdAt', 'DESC');

    if (searchTerm) {
      queryBuilder.where('colors.color ILIKE :search', {
        search: `%${searchTerm}%`,
      });
    }

    const totalAmount = await queryBuilder.getCount();

    queryBuilder.take(take);
    queryBuilder.skip(skip);

    const colors = await queryBuilder.getMany();

    return {
      colors,
      total: totalAmount,
    };
  }

  async createOne(createColorDTO: CreateColorDTO) {
    const color = await this.colorEntity
      .createQueryBuilder('colors')
      .where('colors.color = :color OR colors.hex = :hex', {
        ...createColorDTO,
      })
      .getOne();

    if (color) {
      throw new BadRequestException('Color or hex are already created');
    }

    const newColor = new ColorEntity();
    Object.assign(newColor, createColorDTO);

    await this.colorEntity.save(newColor);

    return { success: true };
  }

  async updateOne(colorId: string, updateColorDTO: CreateColorDTO) {
    const { hex, color } = updateColorDTO;
    const updateColor = await this.findOneById(colorId);

    const equalColor = await this.colorEntity
      .createQueryBuilder('color')
      .where(
        '(color.hex = :hex OR color.color = :color) AND color.id <> :colorId',
        {
          hex,
          color,
          colorId,
        },
      )
      .getOne();

    if (equalColor) {
      throw new BadRequestException('Color or hex is already used');
    }

    updateColor.color = color;
    updateColor.hex = hex;
    updateColor.updatedAt = new Date();

    await this.colorEntity.save(updateColor);

    return {
      success: true,
    };
  }

  async removeOne(colorId: string) {
    const color = await this.findOneById(colorId, ['cars']);

    if (color.cars.length) {
      throw new BadRequestException('Color is used in some cars');
    }

    await this.colorEntity.remove(color);

    return {
      success: true,
    };
  }

  transformPaginationQuery(paginationQuery: PaginationQueryDTO) {
    return {
      page: Number(paginationQuery.page),
      pageSize: Number(paginationQuery.pageSize),
    };
  }
}
