import {
  IsNotEmpty,
  IsEmail,
  IsString,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRolesEnum } from 'core/enums/userRole.enum';

// import { UserRolesEnum } from 'src/core/enums/userRole.enum';

export class CreateUserDTO {
  @ApiProperty({ type: String, name: 'firstName', required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  readonly firstName: string;

  @ApiProperty({ type: String, name: 'lastName', required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  readonly lastName: string;

  @ApiProperty({ type: String, name: 'email', required: true })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ type: String, name: 'password', required: true, minLength: 5 })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(4000)
  readonly password: string;

  @ApiPropertyOptional({
    enum: UserRolesEnum,
    default: UserRolesEnum.Guest,
  })
  @IsOptional()
  @IsEnum(UserRolesEnum)
  readonly role?: UserRolesEnum;
}
