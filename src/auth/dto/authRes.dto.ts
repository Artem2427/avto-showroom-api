import { ApiProperty } from '@nestjs/swagger';
import { IToken } from '../types/token.interface';

export class AuthResDTO implements IToken {
  @ApiProperty({
    type: String,
    name: 'accessToken',
  })
  readonly accessToken: string;
}
