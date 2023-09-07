import { Injectable } from '@nestjs/common';
import { ArrayType } from '@xenopomp/advanced-types';
import axios from 'axios';

import { Currency, XmlChild, currencyCodes } from './currency.interface';

@Injectable()
export class CurrencyService {
	async getCurrency(): Promise<Record<Exclude<Currency, 'RUB'>, number>> {
		const res: Awaited<ReturnType<typeof this.getCurrency>> = {
			EUR: 0,
			USD: 0,
			KZT: 0,
			TRY: 0,
		};

		const xml = require('xml-parse');
		const xmlAsp = await axios.get('https://cbr.ru/scripts/XML_daily.asp');

		const parsedXml = xml.parse(xmlAsp.data);
		const values: XmlChild[] = parsedXml[1].childNodes as XmlChild[];

		const codes = values
			.map(value =>
				value.childNodes.filter(node =>
					['NumCode', 'Value', 'Nominal'].includes(node.tagName)
				)
			)
			.map(group => {
				const code = group
					.find(item => item.tagName === 'NumCode')
					.childNodes.at(0).text;

				const value = parseFloat(
					group
						.find(item => item.tagName === 'Value')
						.childNodes.at(0)
						?.text.replace(/\,/, '.') ?? '0'
				);

				const nominal = parseFloat(
					group.find(item => item.tagName === 'Nominal')?.childNodes.at(0)
						?.text ?? '1'
				);

				const price = value / nominal;

				return {
					code,
					price,
				};
			});

		const returnPropertyName: keyof ArrayType<typeof codes> = 'price';

		res.USD = codes.find(code => code.code === currencyCodes.USD)[
			returnPropertyName
		];
		res.KZT = codes.find(code => code.code === currencyCodes.KZT)[
			returnPropertyName
		];
		res.EUR = codes.find(code => code.code === currencyCodes.EUR)[
			returnPropertyName
		];
		res.TRY = codes.find(code => code.code === currencyCodes.TRY)[
			returnPropertyName
		];

		return res;
	}
}
