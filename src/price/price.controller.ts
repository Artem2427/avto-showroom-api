import {
  Body,
  Controller,
  Get,
  Logger,
  Patch,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PriceService } from './price.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChangeCurrencyDTO } from './dto/changeCurrency.dto';

@ApiTags('Price flow')
@Controller('price')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get()
  @ApiExcludeEndpoint()
  async getCurenncies() {
    return await this.priceService.fetchCurrentCurrency();
  }

  @ApiOperation({ summary: 'Get current currency' })
  @Get('current')
  // @ApiExcludeEndpoint()
  async getCurrentCurenncies() {
    return await this.priceService.getCurrentCurrency();
  }

  @Patch()
  @UsePipes(new ValidationPipe())
  async changeCarrency(@Body() changeCurrencyDTO: ChangeCurrencyDTO) {
    return this.priceService.changeCurrency(changeCurrencyDTO);
  }

  @Cron(CronExpression.EVERY_DAY_AT_1PM)
  async updatePrice() {
    Logger.log('Cron!');
    return await this.priceService.fetchCurrentCurrency();
  }
}
