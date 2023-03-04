import { Directive, forwardRef } from '@angular/core';
import { FormControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
	selector: '[validate-date]',
	providers: [
		{
			provide: NG_VALIDATORS,
			useExisting: forwardRef(() => DateValidator),
			multi: true
		}
	]
})
export class DateValidator {

	validate(c: FormControl) {
		const dateString = c.value;
		const errorResult = { validateDate: { valid: false	} };
		return this.validateDateString(dateString) ? null : errorResult;
	}

	private validateDateString(dateString: string): boolean {
		if (!dateString || dateString === '' ) {
			return true;
		}

		const re = /^(\d{1,2})[\\\/-](\d{1,2})[\\\/-](\d{4})$/;
		if (!re.test(dateString)) {
			return false;
		}

		var parts = this.replaceAll(this.replaceAll(dateString, '\\\\', '/'), '-', '/').split('/');
		var day   = parseInt(parts[0], 10);
		var month = parseInt(parts[1], 10);
		var year  = parseInt(parts[2], 10);

		const date = new Date(year, month-1, day);
		if (date.getDate() !== day || date.getMonth()+1 !== month || date.getFullYear() !== year) {
			return false;
		}

		return true;
	}

	private replaceAll(str: string, find: string, replace: string) {
		return str.replace(new RegExp(find, 'g'), replace);
	}
}
