import {
  Body,
  Controller,
  Get,
  Patch,
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
// import { PaginationQueryDTO } from 'src/core/dto/pagination.query.dto';
// import { UserRolesEnum } from 'src/core/enums/userRole.enum';
import { Roles } from './decorator/role.decorator';
import { User } from './decorator/user.decorator';
import { ChangePasswordDTO } from './dto/changePassowrd.dto';
import { UpdateAvatarDTO } from './dto/updateAvatar.dto';
import { UpdateUserDTO } from './dto/updateUser.dto';
import { UserEntity } from './entity/user.entity';
import { RoleGuard } from './guards/role.guard';
import { UserService } from './user.service';
import { PaginationQueryDTO } from '../../core/dto/pagination.query.dto';
import { UserRolesEnum } from '../../core/enums/userRole.enum';

@ApiTags('User flow')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Test' })
  @Get('test')
  get() {
    return {};
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user data' })
  @ApiOkResponse({ type: UserEntity })
  @Get()
  @UseGuards(AuthGuard)
  async currentUser(@User() user: UserEntity): Promise<UserEntity> {
    return user;
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get users for admin panel' })
  @Get('admin')
  @Roles(UserRolesEnum.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  @UsePipes(new ValidationPipe())
  async findUsers(@Query() paginationQueryDTO: PaginationQueryDTO) {
    return await this.userService.findUsers(
      this.userService.transformPaginationQuery(paginationQueryDTO),
    );
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update user data' })
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
  @Patch('/profile')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  async updateProfile(
    @User() user: UserEntity,
    @Body() userUpdateDto: UpdateUserDTO,
  ) {
    return await this.userService.updateUserProfile(user, userUpdateDto);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update user avatar' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateAvatarDTO })
  @Patch('update-avatar')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  async updateUserAvatar(
    @User() user: UserEntity,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.userService.updateImage(user, file);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Change password' })
  @Patch('/change-password')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  async changePassowrd(
    @User('id') userId: string,
    @Body() changePassowrdDto: ChangePasswordDTO,
  ) {
    return await this.userService.changePassword(userId, changePassowrdDto);
  }
}
