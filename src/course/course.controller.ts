import { Controller, Get } from '@nestjs/common';
import scrapSite from 'ts-website-scrapper';

import { pullPattern } from '../assets/utils/pullPattern';

import { CourseService } from './course.service';

@Controller('course')
export class CourseController {
	constructor(private readonly courseService: CourseService) {}

	@Get()
	async getCourse(): Promise<number | undefined> {
		const targetSite = 'https://oldubil-balance.ru';

		let result: Awaited<ReturnType<typeof this.getCourse>> = undefined;

		const { root, loader } = await scrapSite(targetSite, {}, 'body script');

		root.each((i, script) => {
			if (i === 0) {
				const varLine: string = pullPattern(
					loader(script).text(),
					'var rub = \\$\\(\\"\\.ammount\\"\\)\\.val\\(\\) \\* 5\\.2;',
					{
						flags: 'gim',
					}
				);

				result = parseFloat(varLine.replace(/(^.*\s\*\s)|(\;$)/gim, ''));
			}
		});

		return result;
	}
}
