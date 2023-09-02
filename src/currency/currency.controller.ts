import { Controller, Get, HttpCode } from '@nestjs/common';

import { Currency } from './currency.interface';
import { CurrencyService } from './currency.service';

@Controller('currency')
export class CurrencyController {
	constructor(private readonly currencyService: CurrencyService) {}

	@HttpCode(200)
	@Get()
	async getCurrency(): Promise<Record<Exclude<Currency, 'RUB'>, number>> {
		return this.currencyService.getCurrency();
	}
}
