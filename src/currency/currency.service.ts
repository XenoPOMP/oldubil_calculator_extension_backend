import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { Currency, XmlChild, currencyCodes } from './currency.interface';

@Injectable()
export class CurrencyService {
	async getCurrency(): Promise<Record<Exclude<Currency, 'RUB'>, number>> {
		const res: Awaited<ReturnType<typeof this.getCurrency>> = {
			EUR: 0,
			USD: 0,
			KZT: 0,
		};

		const xml = require('xml-parse');
		const xmlAsp = await axios.get('https://cbr.ru/scripts/XML_daily.asp');

		const parsedXml = xml.parse(xmlAsp.data);
		const values: XmlChild[] = parsedXml[1].childNodes as XmlChild[];

		const codes = values
			.map(value =>
				value.childNodes.filter(
					node => node.tagName === 'NumCode' || node.tagName === 'Value'
				)
			)
			.map(group => {
				const code = group
					.find(item => item.tagName === 'NumCode')
					.childNodes.at(0).text;

				const nominal = parseFloat(
					group
						.find(item => item.tagName === 'Value')
						.childNodes.at(0)
						?.text.replace(/\,/, '.') ?? '0'
				);

				return {
					code,
					nominal,
				};
			});

		res.USD = codes.find(code => code.code === currencyCodes.USD).nominal;
		res.KZT = codes.find(code => code.code === currencyCodes.KZT).nominal;
		res.EUR = codes.find(code => code.code === currencyCodes.EUR).nominal;

		return res;
	}
}
