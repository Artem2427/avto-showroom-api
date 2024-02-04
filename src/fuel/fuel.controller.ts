import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { UserRolesEnum } from 'src/core/enums/userRole.enum';
import { Roles } from 'src/user/decorator/role.decorator';
import { RoleGuard } from 'src/user/guards/role.guard';
import { CreateFuelDTO } from './dto/createFuel.dto';
import { FuelEntity } from './entity/fuelType.entity';
import { FuelService } from './fuel.service';

@ApiTags('Fuel flow')
@Controller('fuel')
export class FuelController {
  constructor(private readonly fuelService: FuelService) {}

  @ApiOperation({ summary: 'Get all fuels' })
  @ApiResponse({ type: [FuelEntity] })
  @Get('all')
  async findAllWithOutCars(): Promise<FuelEntity[]> {
    return await this.fuelService.findAllWithOutCars();
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create new fuel' })
  @Post()
  @Roles(UserRolesEnum.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  @UsePipes(new ValidationPipe())
  async createOne(@Body() createFuelDTO: CreateFuelDTO) {
    return await this.fuelService.createOne(createFuelDTO);
  }
}
