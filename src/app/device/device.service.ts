import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { Supplier, Distributor } from '../transaction/model';

@Injectable({
	providedIn: 'root'
})
export class DeviceService {
	private url = 'api/vendor/';

	constructor(
		private httpClient: HttpClient
	) {}

	private suppliers$: Observable<Supplier[]>;
	private distributors$: Observable<Distributor[]>;

	getSuppliers(): Observable<Supplier[]> {
		if (!this.suppliers$) {
			this.suppliers$ = this.httpClient
				.get<Supplier[]>(this.url + 'suppliers')
				.pipe(
					map(x => x.map(y => new Supplier(y))),
					shareReplay(1)
				);
		}
		return this.suppliers$;
	}

	getDistributors(): Observable<Distributor[]> {
		if (!this.distributors$) {
			this.distributors$ = this.httpClient
				.get<Distributor[]>(this.url + 'distributors')
				.pipe(
					map(x => x.map(y => new Distributor(y))),
					shareReplay(1)
				);
		}
		return this.distributors$;
	}

	private getHttpParams(filter?: {[index: string]:any}): {} {
		let params = new HttpParams();
		if (filter) {
			Object.keys(filter)
				.filter(property => !property.startsWith('_'))
				.forEach(property => {
					const value = filter[property];
					if (value !== null && value !== undefined) {
						params = params.append(property, `${value}`);
					}
				});
		}
		return { params };
	}
}
