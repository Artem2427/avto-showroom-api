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
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';
// import { UserRolesEnum } from 'src/core/enums/userRole.enum';
import { Roles } from '../user/decorator/role.decorator';
import { RoleGuard } from '../user/guards/role.guard';
import { CreateTransmissionDTO } from './dto/createTransmisson.dto';
import { TransmissionEntity } from './entity/trnasmission.entity';
import { TransmissionService } from './transmission.service';
import { UserRolesEnum } from '../../core/enums/userRole.enum';

@ApiTags('Transmission flow')
@Controller('transmission')
export class TransmissionController {
  constructor(private readonly transmissionService: TransmissionService) {}

  @ApiOperation({ summary: 'Get all transmissions' })
  @ApiOkResponse({ type: [TransmissionEntity] })
  @Get('all')
  async findAllWithOutCars(): Promise<TransmissionEntity[]> {
    return await this.transmissionService.findAllWithOutCars();
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create new transmission' })
  @Post()
  @Roles(UserRolesEnum.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  @UsePipes(new ValidationPipe())
  async createOne(@Body() createTransmissionDTO: CreateTransmissionDTO) {
    return await this.transmissionService.createOne(createTransmissionDTO);
  }
}
