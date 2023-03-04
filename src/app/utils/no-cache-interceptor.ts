import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class NoCacheInterceptor implements HttpInterceptor {
	intercept(
		req: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		const changedReq = req.clone({
			headers: req.headers.set('Cache-Control', 'no-cache')
				.set('Pragma', 'no-cache')
				.set('Expires', 'Sat, 01 Jan 2000 00:00:00 GMT')
		});
		return next.handle(changedReq);
	}
}
