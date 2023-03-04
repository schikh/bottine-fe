import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, tap, catchError } from 'rxjs';
import { SpinnerService } from './spinner.service';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {

	constructor(private spinnerService: SpinnerService) {}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		this.spinnerService.incrementRequestCount();
		return next
			.handle(request)
			.pipe(
				tap((event: HttpEvent<any>) => {
					if (event instanceof HttpResponse) {
						this.spinnerService.decrementRequestCount();
					}
				}),
				catchError((err: any) => {
					this.spinnerService.decrementRequestCount();
					return throwError(err);
				})
			);
	}
}
