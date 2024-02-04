import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { Roles } from '../user/decorator/role.decorator';
import { RoleGuard } from 'src/user/guards/role.guard';
import { CarService } from './car.service';
import { AddCarImageDTO } from './dto/addCarImage.dto';
import { CarPaginateBodyDTO } from './dto/carPaginateBody.dto';
import { ChangeMainImageDTO } from './dto/changeMainImage.dto';
import { CreateCarDTO } from './dto/createCar.dto';
import { PaginationFilterDTO } from './dto/paginationFilter.dto';
import { PaginationQueryDTO } from './dto/paginationQuery.dto';
import { PaginationResDTO } from './dto/paginationRes.dto';
import { RemoveImageQueryDTO } from './dto/removeImageQuery.dto';
import { UpdateCarDTO } from './dto/updateCar.dto';
import { CarEntity } from './entity/car.entity';
import { ResSuccessDTO } from '../../core/dto/resSuccess.dto';
import { UserRolesEnum } from '../../core/enums/userRole.enum';
import { CarOrderingFieldsEnum } from '../../core/enums/carOrederingFields.enum';
import { CarAdminOrderingFieldsEnum } from '../../core/enums/carAdminOrederingFields.enum';

@ApiTags('Car flow')
@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @ApiOperation({ summary: 'Get one car' })
  @ApiOkResponse({ type: CarEntity })
  @Get('one/:carId')
  async findOneWithRelations(
    @Param('carId', IdValidationPipe) carId: string,
  ): Promise<CarEntity> {
    return await this.carService.findOneWithRelations(carId);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get cars for admin panel' })
  @Get('admin')
  @Roles(UserRolesEnum.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  @UsePipes(new ValidationPipe())
  async findAdminCars(
    @Query() paginationQuery: PaginationQueryDTO<CarAdminOrderingFieldsEnum>,
  ) {
    return await this.carService.findAdminCars(
      this.carService.transformQueryPagination<CarAdminOrderingFieldsEnum>(
        paginationQuery,
      ),
    );
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: "Find cars' images" })
  @Get('/images/:carId')
  @Roles(UserRolesEnum.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  async findAllImagesByCar(@Param('carId', IdValidationPipe) carId: string) {
    return await this.carService.findAllImagesByCar(carId);
  }

  @ApiOperation({ summary: 'Find cars with conditions' })
  @ApiOkResponse({ type: PaginationResDTO })
  @ApiBody({ type: CarPaginateBodyDTO })
  @Post('paginate')
  @UsePipes(new ValidationPipe())
  async findAllPagination(
    @Query() paginationQuery: PaginationQueryDTO<CarOrderingFieldsEnum>,
    @Body('filters') paginationDto: PaginationFilterDTO[],
  ): Promise<PaginationResDTO> {
    return await this.carService.findAllPagination(
      this.carService.transformPaginationData<CarOrderingFieldsEnum>(
        paginationQuery,
        paginationDto,
      ),
    );
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create new car' })
  @ApiOkResponse({ type: ResSuccessDTO })
  @Post('create')
  @Roles(UserRolesEnum.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  @UsePipes(new ValidationPipe())
  async createOne(@Body() createCarDTO: CreateCarDTO) {
    return await this.carService.createOne(createCarDTO);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Add car image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: AddCarImageDTO })
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       comment: { type: 'string' },
  //       outletId: { type: 'integer' },
  //       file: {
  //         type: 'string',
  //         format: 'binary',
  //       },
  //     },
  //   },
  // })
  @Post('/:carId/image')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new ValidationPipe())
  @Roles(UserRolesEnum.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  async updateProfile(
    @Param('carId', IdValidationPipe) carId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.carService.addImage(carId, file);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update car' })
  @ApiOkResponse({ type: ResSuccessDTO })
  @Patch(':carId')
  @Roles(UserRolesEnum.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  @UsePipes(new ValidationPipe())
  async updateOne(
    @Param('carId', IdValidationPipe) carId: string,
    @Body() updateCarDto: UpdateCarDTO,
  ) {
    return await this.carService.updateOne(carId, updateCarDto);
  }

  @Patch('change-main-image/:carId')
  @UsePipes(new ValidationPipe())
  async changeMainImage(
    @Param('carId', IdValidationPipe) carId: string,
    @Body() mainImageDto: ChangeMainImageDTO,
  ) {
    return await this.carService.changeMainImage(carId, mainImageDto.mainImage);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remove one' })
  @ApiOkResponse({ type: ResSuccessDTO })
  @Roles(UserRolesEnum.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':carId')
  async removeOne(@Param('carId', IdValidationPipe) carId: string) {
    return await this.carService.removeOne(carId);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remove car image' })
  @Delete('image/:carId')
  @Roles(UserRolesEnum.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  @UsePipes(new ValidationPipe())
  async removeCarImage(
    @Param('carId', IdValidationPipe) carId: string,
    @Query() imageLink: RemoveImageQueryDTO,
  ) {
    return await this.carService.removeImageOne(carId, imageLink);
  }
}
