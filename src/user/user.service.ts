import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { FileService } from 'src/file/file.service';
import { API_URL } from 'src/file/fileConstants';
import { Repository } from 'typeorm';
import { ChangePasswordDTO } from './dto/changePassowrd.dto';
import { UpdateUserDTO } from './dto/updateUser.dto';
import { UserEntity } from './entity/user.entity';
import { PaginationQueryDTO } from 'src/core/dto/pagination.query.dto';
import { IPaginationQuery } from 'src/core/types/pagination.intrface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly fileService: FileService,
  ) {}
  async findByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findUsers(paginationQuery: IPaginationQuery) {
    const { pageSize, page, searchTerm } = paginationQuery;

    const take = pageSize || 30;
    const skip = (page - 1) * take;

    const queryBuilder = this.userRepository.createQueryBuilder('users');

    if (searchTerm) {
      queryBuilder.where(
        `(users.phone ILIKE :search OR CONCAT(users.firstName, ' ', users.lastName) ILIKE :search OR users.email ILIKE :search) AND users.role != :role`,
        {
          search: `%${searchTerm}%`,
          role: 'admin',
        },
      );
    }

    queryBuilder.andWhere('users.role != :role', { role: 'admin' });

    const totalAmount = await queryBuilder.getCount();

    queryBuilder.take(take);
    queryBuilder.skip(skip);

    const users = await queryBuilder.getMany();

    return {
      users,
      total: totalAmount,
    };
  }

  async updateImage(user: UserEntity, file: Express.Multer.File) {
    if (file) {
      const avatar = await this.fileService.uploadImageFile(
        file,
        API_URL.upload,
      );
      user.avatar = avatar;
      user.updatedAt = new Date();
    }

    await this.userRepository.save(user);

    return {
      success: true,
    };
  }

  async updateUserProfile(user: UserEntity, updateUserDto: UpdateUserDTO) {
    const equalUser = await this.userRepository
      .createQueryBuilder('user')
      .where(
        'user.id <> :userId AND (user.email = :email OR user.phone = :phone)',
        {
          userId: user.id,
          email: updateUserDto.email,
          phone: updateUserDto.phone ?? '',
        },
      )
      .getOne();

    if (equalUser) {
      throw new BadRequestException('Phone or email is alerady used!');
    }

    Object.assign(user, updateUserDto);
    user.updatedAt = new Date();

    await this.userRepository.save(user);

    return {
      success: true,
    };
  }

  async changePassword(userId: string, changePassowrdDto: ChangePasswordDTO) {
    const user = await this.userRepository.findOne({
      select: [
        'id',
        'firstName',
        'lastName',
        'password',
        'email',
        'phone',
        'avatar',
        'role',
      ],
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.NOT_FOUND,
      );
    }

    const isPassEquals = await bcrypt.compare(
      changePassowrdDto.currentPassword,
      user.password,
    );

    if (!isPassEquals) {
      throw new BadRequestException('Current password is incorrect!');
    }

    if (user.password === changePassowrdDto.newPassword) {
      throw new BadRequestException('Current password is equal new password!');
    }

    user.password = await bcrypt.hash(changePassowrdDto.newPassword, 10);

    await this.userRepository.save(user);

    return {
      success: true,
    };
  }

  transformPaginationQuery(
    paginationQuery: PaginationQueryDTO,
  ): IPaginationQuery {
    return {
      page: Number(paginationQuery.page),
      pageSize: Number(paginationQuery.pageSize),
      searchTerm: paginationQuery.searchTerm
        ? paginationQuery.searchTerm.trim()
        : '',
    };
  }
}
