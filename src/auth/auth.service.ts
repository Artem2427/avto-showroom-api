import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/createUser.dto';
import { LoginUserDTO } from './dto/userLogin.dto';
import { IToken, TokenDecodeData } from './types/token.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configservice: ConfigService,
  ) {}

  async registrationUser(createUserDto: CreateUserDTO) {
    const user = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (user) {
      throw new HttpException(
        'Email is taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);

    const newUserFromDatabase = await this.userRepository.save(newUser);

    return this.generateToken({
      id: newUserFromDatabase.id,
      email: newUserFromDatabase.email,
    });
  }

  async login(loginUserDto: LoginUserDTO) {
    const user = await this.userRepository.findOne({
      select: [
        'firstName',
        'lastName',
        'password',
        'email',
        'phone',
        'avatar',
        'role',
      ],
      where: { email: loginUserDto.email },
    });

    if (!user) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.NOT_FOUND,
      );
    }

    const isPassEquals = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPassEquals) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.NOT_FOUND,
      );
    }

    return this.generateToken({
      id: user.id,
      email: user.email,
    });
  }

  validateToken(token: string, secret: string): TokenDecodeData | null {
    try {
      const userData = <TokenDecodeData>jwt.verify(token, secret);
      return userData;
    } catch (error) {
      return null;
    }
  }

  generateToken(secretData: TokenDecodeData): IToken {
    const accessToken = jwt.sign(
      secretData,
      this.configservice.get('JWT_SECRET'),
      {
        expiresIn: '2h',
      },
    );

    return {
      accessToken,
    };
  }
}
