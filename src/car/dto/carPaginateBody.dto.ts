import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { PaginationFilterDTO } from './paginationFilter.dto';

export class CarPaginateBodyDTO {
  @ApiProperty({ type: [PaginationFilterDTO] })
  @IsNotEmpty()
  filters: PaginationFilterDTO[];
}
