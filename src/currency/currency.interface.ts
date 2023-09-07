export type Currency = 'RUB' | 'USD' | 'KZT' | 'EUR' | 'TRY';

export const currencyCodes: Record<Exclude<Currency, 'RUB'>, string> = {
	USD: '840',
	KZT: '398',
	EUR: '978',
	TRY: '949',
};

export type XmlChild = {
	type: string;
	tagName: string;
	attributes: any;
	childNodes: XmlChild[];
	innerXML: any;
	closing: boolean;
	closingChar: string | null;
	text?: string;
	index?: number;
};
