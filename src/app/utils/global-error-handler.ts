import { ErrorHandler, Inject, Injectable, Injector, NgZone } from '@angular/core';
import { DialogService } from '../shared/dialog.service';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {
	constructor(
		@Inject(Injector)
		private injector: Injector,
		private zone: NgZone
	) {
		super();
	}

	private get dialogService(): DialogService {
		return this.injector.get(DialogService);
	}

	override handleError(error: any): void {
		error = error.error || error;
        const message = error.ExceptionMessage || error.message || error.Message;
		this.dialogService.error(message, 'Erreur technique');
		super.handleError(error);
	}
}
