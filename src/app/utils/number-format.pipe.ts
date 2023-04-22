import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'numberformat'
 })
export class NumberFormatPipe implements PipeTransform {

	transform(value: number): string {
		return NumberFormatPipe.transform(value);
	}

	static transform(value: number): string {
		return value ? value.toFixed(2).replace('.', ',') : '';
	}
}
