import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilterResDTO } from './dto/filter.response.dto';
import { FilterService } from './filter.service';

@ApiTags('Filter flow')
@Controller('filter')
export class FilterController {
  constructor(private readonly filterService: FilterService) {}

  @ApiOperation({ summary: 'Get all filters' })
  @ApiOkResponse({ type: FilterResDTO })
  @Get()
  async getAllFilters(): Promise<FilterResDTO> {
    return await this.filterService.getAllFilters();
  }
}
