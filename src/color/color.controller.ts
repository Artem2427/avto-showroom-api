import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { PaginationQueryDTO } from 'src/core/dto/pagination.query.dto';
import { UserRolesEnum } from 'src/core/enums/userRole.enum';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { Roles } from 'src/user/decorator/role.decorator';
import { RoleGuard } from 'src/user/guards/role.guard';
import { ColorService } from './color.service';
import { CreateColorDTO } from './dto/createColor.dto';

import { ColorEntity } from './entity/color.entity';

@ApiTags('Color flow')
@Controller('color')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @ApiOperation({ summary: 'Get all colors' })
  @ApiResponse({ type: [ColorEntity] })
  @Get('all')
  async findAllWithOutCars(): Promise<ColorEntity[]> {
    return await this.colorService.findAllWithOutCars();
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Find all for admin' })
  @Get('admin')
  @Roles(UserRolesEnum.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  @UsePipes(new ValidationPipe())
  async findAllForAdmin(@Query() paginationQuery: PaginationQueryDTO) {
    return await this.colorService.findAllForAdmin({
      ...paginationQuery,
      searchTerm: paginationQuery.searchTerm
        ? paginationQuery.searchTerm.trim()
        : '',
    });
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create new color' })
  @Post()
  @Roles(UserRolesEnum.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  @UsePipes(new ValidationPipe())
  async createOne(@Body() createColorDTO: CreateColorDTO) {
    return await this.colorService.createOne({
      ...createColorDTO,
      color: createColorDTO.color.trim().toLowerCase(),
    });
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update color' })
  @Patch(':colorId')
  @Roles(UserRolesEnum.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  @UsePipes(new ValidationPipe())
  async updateOne(
    @Param('colorId', IdValidationPipe) colorId: string,
    @Body() updateColorDTO: CreateColorDTO,
  ) {
    return await this.colorService.updateOne(colorId, {
      ...updateColorDTO,
      color: updateColorDTO.color.trim().toLowerCase(),
    });
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remove model' })
  @Roles(UserRolesEnum.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':colorId')
  async removeOne(@Param('colorId', IdValidationPipe) colorId: string) {
    return await this.colorService.removeOne(colorId);
  }
}
