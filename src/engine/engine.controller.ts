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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { Roles } from '../user/decorator/role.decorator';
import { RoleGuard } from '../user/guards/role.guard';
import { CreateEngineDTO } from './dto/createEngine.dto';
import { UpdateEngineDTO } from './dto/updateEngine.dto';
import { EngineService } from './engine.service';
import { EngineEntity } from './entity/engine.entity';
import { UserRolesEnum } from '../../core/enums/userRole.enum';

@ApiTags('Engine flow')
@Controller('engine')
export class EngineController {
  constructor(private readonly engineService: EngineService) {}

  @ApiOperation({ summary: 'Get all engines' })
  @ApiOkResponse({ type: [EngineEntity] })
  @Get('all/:modelId')
  async findAllWithOutCars(
    @Param('modelId', IdValidationPipe) modelId: string,
  ): Promise<EngineEntity[]> {
    return await this.engineService.findAllByModelWithOutCars(modelId);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create new engine' })
  @Post()
  @Roles(UserRolesEnum.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  @UsePipes(new ValidationPipe())
  async createOne(@Body() createEngineDTO: CreateEngineDTO) {
    return await this.engineService.createOne(createEngineDTO);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update model' })
  @Patch(':engineId')
  @Roles(UserRolesEnum.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  @UsePipes(new ValidationPipe())
  async updateOne(
    @Param('engineId', IdValidationPipe) engineId: string,
    @Body() updateEngineDTO: UpdateEngineDTO,
  ) {
    return await this.engineService.updateOne(engineId, updateEngineDTO);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remove model' })
  @Roles(UserRolesEnum.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':engineId')
  async removeOne(@Param('engineId', IdValidationPipe) engineId: string) {
    return await this.engineService.removeOne(engineId);
  }
}
