import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
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
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { Roles } from '../user/decorator/role.decorator';
import { RoleGuard } from '../user/guards/role.guard';
import { BrandService } from './brand.service';
import { BrandCreateDTO } from './dto/brandCreate.dto';
import { BrandUpdateDTO } from './dto/brandUpdate.dto';
import { BrandEntity } from './entity/brand.entity';
import { PaginationQueryDTO } from '../../core/dto/pagination.query.dto';
import { UserRolesEnum } from '../../core/enums/userRole.enum';

@ApiTags('Brand flow')
@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @ApiOperation({ summary: 'Get all body types' })
  @ApiOkResponse({ type: [BrandEntity] })
  @Get('all')
  async findAllWithOutCars(): Promise<BrandEntity[]> {
    return await this.brandService.findAllWithOutCars();
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Find brands for admin' })
  @Get('admin')
  @Roles(UserRolesEnum.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  @UsePipes(new ValidationPipe())
  async findAllForAdmin(@Query() paginationQuery: PaginationQueryDTO) {
    return await this.brandService.findAllForAdmin({
      ...paginationQuery,
      searchTerm: paginationQuery.searchTerm
        ? paginationQuery.searchTerm.trim()
        : '',
    });
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create new brand' })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    status: HttpStatus.CREATED,
    description: 'Brand has been created successfully',
  })
  @Post()
  @Roles(UserRolesEnum.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('file'))
  async createOne(
    @Body() brandCreateDto: BrandCreateDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.brandService.createOne(brandCreateDto, file);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update brand' })
  @Patch(':brandId')
  @Roles(UserRolesEnum.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateOne(
    @Param('brandId', IdValidationPipe) brandId: string,
    @Body() brandUpdateDto: BrandUpdateDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.brandService.updateOne(brandId, brandUpdateDto, file);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remove brand' })
  @Delete(':id')
  @Roles(UserRolesEnum.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  async deleteOne(@Param('id', IdValidationPipe) id: string) {
    return await this.brandService.deleteOne(id);
  }
}
