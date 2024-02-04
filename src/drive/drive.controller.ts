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
import { AuthGuard } from 'src/auth/guard/auth.guard';
// import { UserRolesEnum } from 'src/core/enums/userRole.enum';
import { Roles } from 'src/user/decorator/role.decorator';
import { RoleGuard } from 'src/user/guards/role.guard';
import { DriveService } from './drive.service';
import { CreateDriveDTO } from './dto/createDrive.dto';
import { DriveEntity } from './entity/drive.entity';
import { UserRolesEnum } from 'core/enums/userRole.enum';

@ApiTags('Drive flow')
@Controller('drive')
export class DriveController {
  constructor(private readonly driveService: DriveService) {}

  @ApiOperation({ summary: 'Get all drives' })
  @ApiOkResponse({ type: [DriveEntity] })
  @Get('all')
  async findAllWithOutCars(): Promise<DriveEntity[]> {
    return await this.driveService.findAllWithOutCars();
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create new drive' })
  @Post()
  @Roles(UserRolesEnum.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  @UsePipes(new ValidationPipe())
  async createOne(@Body() createDriveDTO: CreateDriveDTO) {
    return await this.driveService.createOne(createDriveDTO);
  }
}
