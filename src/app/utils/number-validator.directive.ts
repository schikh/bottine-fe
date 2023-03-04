import { Directive, forwardRef } from '@angular/core';
import { FormControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
	selector: '[validate-number]',
	providers: [
		{
			provide: NG_VALIDATORS,
			useExisting: forwardRef(() => NumberValidatorDirective),
			multi: true
		}
	]
})
export class NumberValidatorDirective {

	validate(c: FormControl) {
		const errorResult = { validateDate: { valid: false	} };
		return this.validateDateString(c.value) ? null : errorResult;
	}

	private validateDateString(value: string): boolean {
		if (!value || value === '' ) {
			return true;
		}
		const re = /^\d+\,?\d{0,2}$/;
		return re.test(value);
	}
}
