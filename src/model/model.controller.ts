import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';
// import { UserRolesEnum } from 'src/core/enums/userRole.enum';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { Roles } from 'src/user/decorator/role.decorator';
import { RoleGuard } from 'src/user/guards/role.guard';
import { CreateModelDTO } from './dto/createModel.dto';
import { ModelEntity } from './entity/model.entity';
import { ModelService } from './model.service';
import { UserRolesEnum } from '../../core/enums/userRole.enum';

@ApiTags('Model flow')
@Controller('model')
export class ModelController {
  constructor(private readonly modelService: ModelService) {}

  @ApiOperation({ summary: 'Get all models by brand' })
  @ApiOkResponse({ type: [ModelEntity] })
  @Get('all/:brandId')
  async findAllWithOutCars(
    @Param('brandId', IdValidationPipe) brandId: string,
  ): Promise<ModelEntity[]> {
    return await this.modelService.findAllByBrandWithOutCars(brandId);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create one model' })
  @Post('create/:brandId')
  @Roles(UserRolesEnum.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  @UsePipes(new ValidationPipe())
  async createOne(
    @Body() createModelDTO: CreateModelDTO,
    @Param('brandId', IdValidationPipe) brandId: string,
  ) {
    return await this.modelService.createOne(brandId, createModelDTO);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update model' })
  @Patch(':modelId')
  @Roles(UserRolesEnum.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  async updateOne(
    @Param('modelId', IdValidationPipe) modelId: string,
    @Body() createModelDTO: CreateModelDTO,
  ) {
    return await this.modelService.updateOne(modelId, createModelDTO);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remove model' })
  @Roles(UserRolesEnum.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':modelId')
  async removeOne(@Param('modelId', IdValidationPipe) modelId: string) {
    return await this.modelService.removeOne(modelId);
  }
}
