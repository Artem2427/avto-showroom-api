import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDTO {
  @ApiProperty({ type: String, required: true, minLength: 5 })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(4000)
  readonly currentPassword: string;

  @ApiProperty({ type: String, required: true, minLength: 5 })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(4000)
  readonly newPassword: string;
}
