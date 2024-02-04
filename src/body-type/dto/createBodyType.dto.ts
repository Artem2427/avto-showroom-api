import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BodyTypeEnum } from 'core/enums/bodyType.enum';
// import { BodyTypeEnum } from 'src/core/enums/bodyType.enum';

export class CreateBodyTypeDTO {
  @ApiProperty({ enum: BodyTypeEnum })
  @IsNotEmpty()
  @IsEnum(BodyTypeEnum)
  readonly body: BodyTypeEnum;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  readonly icon: string;
}
