import {
  BadRequestException,
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { IBankRate } from './types/bankRate.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { PriceEntity } from './entity/price.entity';
import { Repository } from 'typeorm';
// import { CurrencyEnum } from 'src/core/enums/currency.enum';
import { ChangeCurrencyDTO } from './dto/changeCurrency.dto';
import { CarService } from 'src/car/car.service';
import { CurrencyEnum } from '../../core/enums/currency.enum';

@Injectable()
export class PriceService {
  constructor(
    @InjectRepository(PriceEntity)
    private readonly priceRepository: Repository<PriceEntity>,
    private readonly httpService: HttpService,
    private readonly carService: CarService,
  ) {}

  async findOldPrice(): Promise<PriceEntity[]> {
    return await this.priceRepository.find();
  }

  async getCurrentCurrency() {
    const price = await this.findOldPrice();
    return { currentCurrency: price[0].currentCurrency };
  }

  async changeCurrency(changeCurrencyDTO: ChangeCurrencyDTO) {
    const cars = await this.carService.findAllWithOutRelations();

    if (cars.length && cars[0].currency === changeCurrencyDTO.currency) {
      throw new HttpException('Currency is used now', HttpStatus.BAD_REQUEST);
    }
    const price = (await this.findOldPrice())[0];

    for (let i = 0; i < cars.length; i++) {
      const newPrice =
        (cars[i].price / price[cars[i].currency]) *
        price[changeCurrencyDTO.currency];

      cars[i].price = newPrice;
      cars[i].currency = changeCurrencyDTO.currency;
      await this.carService.saveOne(cars[i]);
    }

    price.currentCurrency = changeCurrencyDTO.currency;
    await this.priceRepository.save(price);

    return {
      success: true,
    };
  }

  async fetchCurrentCurrency() {
    try {
      const oldPrice = await this.findOldPrice();
      const { data } = await this.httpService.axiosRef.get<IBankRate[]>(
        'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5',
      );

      const usd = data.find((item) => item.ccy === CurrencyEnum.USD);
      const avgUsd = (Number(usd.buy) + Number(usd.sale)) / 2;

      const eurObj = data.find((item) => item.ccy === CurrencyEnum.EUR);
      const eur = avgUsd / ((Number(eurObj.buy) + Number(eurObj.sale)) / 2);

      const btcObj = data.find((item) => item.ccy === CurrencyEnum.BTC);
      const btc = Number(
        (1 / ((Number(btcObj.buy) + Number(btcObj.sale)) / 2)).toFixed(7),
      );

      if (oldPrice.length) {
        oldPrice[0].UAH = avgUsd;
        oldPrice[0].EUR = eur;
        oldPrice[0].BTC = btc;
        oldPrice[0].updatedAt = new Date();
        await this.priceRepository.save(oldPrice);
      } else {
        const newPrice = new PriceEntity();
        newPrice.UAH = avgUsd;
        newPrice.EUR = eur;
        newPrice.BTC = btc;

        await this.priceRepository.save(newPrice);
      }

      return { success: true };
    } catch (error) {
      throw new BadRequestException('Failed to get current rate');
    }
  }
}
