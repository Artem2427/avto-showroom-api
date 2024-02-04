import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';
import { Roles } from '../user/decorator/role.decorator';
import { RoleGuard } from '../user/guards/role.guard';
import { BodyTypeService } from './body-type.service';
import { CreateBodyTypeDTO } from './dto/createBodyType.dto';
import { BodyTypeEntity } from './entity/bodyType.entity';
import { UserRolesEnum } from '../../core/enums/userRole.enum';

@ApiTags('Body type flow')
@Controller('body-type')
export class BodyTypeController {
  constructor(private readonly bodyTypeService: BodyTypeService) {}

  @ApiOperation({ summary: 'Get all body types' })
  @ApiOkResponse({ type: [BodyTypeEntity], description: 'List of bodyTypes' })
  @Get('all')
  async findAllWithOutCars(): Promise<BodyTypeEntity[]> {
    return await this.bodyTypeService.findAllWithOutCars();
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create new body-type' })
  @ApiOkResponse({ description: 'Created' })
  @Post()
  @Roles(UserRolesEnum.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  @UsePipes(new ValidationPipe())
  async createOne(@Body() createBodyTypeDTO: CreateBodyTypeDTO) {
    return await this.bodyTypeService.createOne(createBodyTypeDTO);
  }

  @ApiExcludeEndpoint()
  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    return await this.bodyTypeService.deleteOne(id);
  }
}
