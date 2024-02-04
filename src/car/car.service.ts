import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BodyTypeService } from 'src/body-type/body-type.service';
import { BrandService } from 'src/brand/brand.service';
import { ColorService } from 'src/color/color.service';
// import { CarOrderingFieldsEnum } from 'src/core/enums/carOrederingFields.enum';
// import { SortDirection } from 'src/core/enums/sortDirection.enum';
// import { Utils } from 'src/core/utils/utils';
import { DriveService } from 'src/drive/drive.service';
import { EngineService } from 'src/engine/engine.service';
import { ModelService } from 'src/model/model.service';
import { TransmissionService } from 'src/transmission/transmission.service';
import { Brackets, Repository } from 'typeorm';
import {
  filterCarsFindOptions,
  parseAdminCarsOrdering,
} from './utils/car.utils';
import { CreateCarDTO } from './dto/createCar.dto';
import { PaginationFilterDTO } from './dto/paginationFilter.dto';
import { PaginationQueryDTO } from './dto/paginationQuery.dto';
import { PaginationResDTO } from './dto/paginationRes.dto';
import { UpdateCarDTO } from './dto/updateCar.dto';
import { CarEntity } from './entity/car.entity';
import {
  IPaginationParams,
  OrderingFields,
} from './types/paginationParams.interface';
// import { CarAdminOrderingFieldsEnum } from 'src/core/enums/carAdminOrederingFields.enum copy';
import { RemoveImageQueryDTO } from './dto/removeImageQuery.dto';
import { API_URL } from 'src/file/fileConstants';
import { FileService } from 'src/file/file.service';
import { Utils } from 'core/utils/utils';
import { SortDirection } from 'core/enums/sortDirection.enum';
import { CarOrderingFieldsEnum } from 'core/enums/carOrederingFields.enum';
import { CarAdminOrderingFieldsEnum } from 'core/enums/carAdminOrederingFields.enum';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(CarEntity)
    private readonly carRepository: Repository<CarEntity>,

    private readonly modelService: ModelService,
    private readonly brandService: BrandService,
    private readonly bodyTypeService: BodyTypeService,
    private readonly driveService: DriveService,
    private readonly colorService: ColorService,
    private readonly transmissionService: TransmissionService,
    private readonly engineService: EngineService,
    private readonly fileService: FileService,
  ) {}

  async findOneById(carId: string): Promise<CarEntity> {
    const car = await this.carRepository.findOne({ where: { id: carId } });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    return car;
  }

  async saveOne(car: CarEntity) {
    await this.carRepository.save(car);
    return { success: true };
  }

  async findOneWithRelations(carId: string): Promise<CarEntity> {
    const queryBuilder = this.carRepository
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.brand', 'brand')
      .leftJoinAndSelect('car.model', 'model')
      .leftJoinAndSelect('car.engine', 'engine')
      .leftJoinAndSelect('car.bodyType', 'bodyType')
      .leftJoinAndSelect('engine.fuel', 'fuel')
      .leftJoinAndSelect('car.drive', 'drive')
      .leftJoinAndSelect('car.color', 'color')
      .leftJoinAndSelect('car.transmission', 'transmission')
      .where('car.id = :carId', { carId });

    const car = await queryBuilder.getOne();

    if (!car) {
      throw new NotFoundException('Car with this id not found');
    }

    return car;
  }

  async findAllWithOutRelations(): Promise<CarEntity[]> {
    return await this.carRepository.find();
  }

  async findAdminCars(
    paginationParams: IPaginationParams<CarAdminOrderingFieldsEnum>,
  ) {
    const {
      paginationSettings: { page, pageSize },
      dir,
      ordering,
      searchTerm,
    } = paginationParams;

    const take = pageSize || 30;
    const skip = (page - 1) * take;

    const parseOrdering = parseAdminCarsOrdering(ordering, dir);

    const queryBuilder = this.carRepository
      .createQueryBuilder('car')
      .leftJoin('car.brand', 'brand')
      .leftJoin('car.model', 'model')
      .leftJoin('car.drive', 'drive')
      .leftJoin('car.bodyType', 'bodyType')
      .leftJoin('car.engine', 'engine')
      .leftJoin('engine.fuel', 'fuel')
      .leftJoin('car.color', 'color')
      .leftJoin('car.transmission', 'transmission')
      .select([
        'car.id,car.name, car.createYear, car.createdAt, car.inStock, car.availableCar, car.price, car.currency, car.race, car.createYear, car.seats',
        'brand.name AS brand',
        'model.name AS model',
        'bodyType.body AS body',
        'color.color AS color',
        'transmission.transmission AS transmission',
      ]);

    if (searchTerm) {
      queryBuilder.where('car.name ILIKE :name', { name: `%${searchTerm}%` });
    }

    if (ordering) {
      queryBuilder.orderBy(parseOrdering.sort, parseOrdering.order);
    } else {
      queryBuilder.orderBy('car.createdAt', 'DESC');
    }
    const totalAmount = await queryBuilder.getCount();
    queryBuilder.take(take);
    queryBuilder.skip(skip);

    const cars = await queryBuilder.getRawMany();
    return {
      cars,
      total: totalAmount,
    };
  }

  async findAllImagesByCar(carId: string) {
    const images = await this.carRepository
      .createQueryBuilder('car')
      .select('car.images, car.mainImage')
      .where('car.id = :carId', { carId })
      .getRawOne();

    return images;
  }

  async addImage(carId: string, file: Express.Multer.File) {
    const car = await this.findOneById(carId);

    if (car.images.length === 8) {
      throw new BadRequestException('You can add only 8 images');
    }

    if (file) {
      car.images.push(
        await this.fileService.uploadImageFile(file, API_URL.upload),
      );
    }

    await this.carRepository.save(car);

    return { success: true };
  }

  async findAllPagination(
    paginationParams: IPaginationParams<CarOrderingFieldsEnum> & {
      filters: PaginationFilterDTO[];
    },
  ): Promise<PaginationResDTO> {
    const {
      paginationSettings: { page, pageSize },
      dir,
      ordering,
      searchTerm,
      filters,
    } = paginationParams;

    const params: any = Object.entries(
      Utils.clearEmpties(
        Object.assign(
          {},
          ...filterCarsFindOptions(filters).map((param, index) => ({
            [index]: param,
          })),
        ),
      ),
    )
      .filter((array) => array[1] !== undefined)
      .map((param) => param[1]);

    const take = pageSize || 30;
    const skip = (page - 1) * take;

    const queryBuilder = this.carRepository
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.brand', 'brand')
      .leftJoinAndSelect('car.model', 'model')
      .leftJoinAndSelect('car.drive', 'drive')
      .leftJoinAndSelect('car.bodyType', 'bodyType')
      .leftJoinAndSelect('car.engine', 'engine')
      .leftJoinAndSelect('engine.fuel', 'fuel')
      .leftJoinAndSelect('car.color', 'color')
      .leftJoinAndSelect('car.transmission', 'transmission')
      .where(
        new Brackets((qb) => {
          params.map((param) => {
            return qb.andWhere(
              Object.keys(param).length === 1 ? param.where : param.where,
              param.parameters,
            );
          });
        }),
      );

    if (searchTerm) {
      queryBuilder.where('car.name ILIKE :name', { name: `%${searchTerm}%` });
    }

    queryBuilder.orderBy(
      `car.${ordering}`,
      dir === SortDirection.Descend ? 'DESC' : 'ASC',
    );

    const totalAmount = await queryBuilder.getCount();

    queryBuilder.take(take);
    queryBuilder.skip(skip);

    const cars = await queryBuilder.getMany();

    return {
      cars,
      totalAmount,
    };
  }

  async createOne(createCarDTO: CreateCarDTO) {
    const {
      colorId,
      modelId,
      brandId,
      bodyTypeId,
      driveId,
      engineId,
      transmissionId,
      ...createCarFields
    } = createCarDTO;
    const newCar = new CarEntity();

    Object.assign(newCar, createCarFields);

    const brand = await this.brandService.findOneById(brandId);
    const model = await this.modelService.findOneByBrand(modelId, brandId);
    const engine = await this.engineService.findOneByModel(engineId, modelId);
    const bodyType = await this.bodyTypeService.findOneById(bodyTypeId);
    const drive = await this.driveService.findOneById(driveId);

    const transmission = await this.transmissionService.findOneById(
      transmissionId,
    );
    const color = await this.colorService.findOneById(colorId);

    newCar.model = model;
    newCar.brand = brand;
    newCar.bodyType = bodyType;
    newCar.drive = drive;
    newCar.color = color;
    newCar.transmission = transmission;
    newCar.engine = engine;

    await this.carRepository.save(newCar);

    return { success: true };
  }

  async updateOne(carId: string, updateCarDto: UpdateCarDTO) {
    const car = await this.findOneById(carId);

    Object.assign(car, updateCarDto);

    await this.carRepository.save(car);

    return { success: true };
  }

  async changeMainImage(carId: string, mainImage: number) {
    const car = await this.findOneById(carId);

    if (car.images.length < mainImage && mainImage === 0) {
      throw new BadRequestException(
        `Number of images is ${car.images.length}!`,
      );
    }

    car.mainImage = mainImage;
    await this.carRepository.save(car);

    return { success: true };
  }

  async removeOne(carId: string) {
    const removeCar = await this.findOneById(carId);

    await this.carRepository.remove(removeCar);

    return { success: true };
  }

  async getCarMinAndMaxValues() {
    const carObject = await this.carRepository
      .createQueryBuilder('car')
      .select('MAX(car.price)', 'maxPrice')
      .addSelect('MIN(car.price)', 'minPrice')
      .addSelect('MAX(car.race)', 'maxRace')
      .addSelect('MIN(car.race)', 'minRace')
      .addSelect('MAX(car.createYear)', 'maxCreateYear')
      .addSelect('MIN(car.createYear)', 'minCreateYear')
      .getRawOne();

    return {
      maxPrice: carObject.maxPrice,
      minPrice: carObject.minPrice,
      maxYear: carObject.maxCreateYear,
      minYear: carObject.minCreateYear,
      maxRace: carObject.maxRace,
      minRace: carObject.minRace,
    };
  }

  async removeImageOne(carId: string, removeImageOne: RemoveImageQueryDTO) {
    const car = await this.findOneById(carId);
    const carMainImage = car.mainImage - 1;

    const removeImageMainImageIndex = car.images.findIndex(
      (image) => image === removeImageOne.imageUrl,
    );
    if (removeImageMainImageIndex === carMainImage) {
      throw new BadRequestException("Can't remove active image");
    }

    if (removeImageMainImageIndex < carMainImage) {
      car.mainImage -= 1;
    }

    car.images = car.images.filter(
      (image) => image !== removeImageOne.imageUrl,
    );

    await this.carRepository.save(car);

    return { success: true };
  }

  transformPaginationData<T extends OrderingFields>(
    paginationQuery: PaginationQueryDTO<T>,
    paginationDto: PaginationFilterDTO[],
  ): IPaginationParams<T> & { filters: PaginationFilterDTO[] } {
    return {
      ...this.transformQueryPagination<T>(paginationQuery),
      filters: paginationDto,
    };
  }

  transformQueryPagination<T extends OrderingFields>(
    paginationQuery: PaginationQueryDTO<T>,
  ): IPaginationParams<T> {
    return {
      paginationSettings: {
        page: Number(paginationQuery.page),
        pageSize: Number(paginationQuery.pageSize),
      },
      dir: paginationQuery.dir ?? SortDirection.Descend,
      ordering: paginationQuery.ordering,
      // ?? CarOrderingFieldsEnum.CreatedAt,
      searchTerm: paginationQuery.searchTerm
        ? paginationQuery.searchTerm.trim()
        : '',
    };
  }
}
