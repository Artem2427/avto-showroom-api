import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateUserDTO {
  @ApiProperty({ type: String, name: 'firstName', required: true })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  readonly firstName?: string;

  @ApiProperty({ type: String, name: 'lastName', required: true })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  readonly lastName?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @IsNumberString()
  readonly phone?: string;

  @ApiProperty({ type: String, name: 'email', required: true })
  @IsOptional()
  @IsString()
  @IsEmail()
  readonly email?: string;
}
