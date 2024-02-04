import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthResDTO } from './dto/authRes.dto';
import { CreateUserDTO } from './dto/createUser.dto';
import { LoginUserDTO } from './dto/userLogin.dto';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register new user' })
  @ApiCreatedResponse({
    description: 'User Registration',
  })
  @Post('register')
  @UsePipes(new ValidationPipe())
  async createUser(@Body() createUserDto: CreateUserDTO): Promise<AuthResDTO> {
    return await this.authService.registrationUser(createUserDto);
  }

  @ApiOperation({ summary: 'Log in' })
  @ApiOkResponse({ description: 'User login' })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  async logIn(@Body() loginUserDto: LoginUserDTO): Promise<AuthResDTO> {
    return await this.authService.login(loginUserDto);
  }
}
