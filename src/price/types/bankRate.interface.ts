// import { CurrencyEnum } from 'src/core/enums/currency.enum';

import { CurrencyEnum } from "core/enums/currency.enum";

export interface IBankRate {
  ccy: CurrencyEnum;
  base_ccy: CurrencyEnum;
  buy: string;
  sale: string;
}
