import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { Correction, TransactionsFilter, TransactionHierarchyEntry, TransactionHierarchyFilter, ResubmitTransactionRequest, SearchTransactionResponse } from './model';

@Injectable({
	providedIn: 'root'
})
export class TransactionService {
	private url = 'api/export/';

	constructor(
		private httpClient: HttpClient
	) {}

	private corrections$: Observable<SearchTransactionResponse>;
	private searchCorrectionsChange$ = new Subject<TransactionsFilter>();
	private transactions$: Observable<SearchTransactionResponse>;
	private searchTransactionsChange$ = new Subject<TransactionsFilter>();

	searchCorrections(filter?: TransactionsFilter): void {
		this.searchCorrectionsChange$.next(filter);
	}

	getCorrections(): Observable<SearchTransactionResponse> {
		if (!this.corrections$) {
			this.corrections$ = this.searchCorrectionsChange$.pipe(
				switchMap(filter => this.searchTransactions2(filter)),
				shareReplay(1)
			);
		}
		return this.corrections$;
	}


	searchTransactions(filter?: TransactionsFilter): void {
		this.searchTransactionsChange$.next(filter);
	}

	getTransactions(): Observable<SearchTransactionResponse> {
		if (!this.transactions$) {
			this.transactions$ = this.searchTransactionsChange$.pipe(
				switchMap(filter => this.searchTransactions2(filter)),
				shareReplay(1)
			);
		}
		return this.transactions$;
	}

	searchTransactions2(filter?: TransactionsFilter): Observable<SearchTransactionResponse> {
		const params = this.getHttpParams(filter);
		return this.httpClient
			.get<SearchTransactionResponse>(this.url + 'transaction', params)
			.pipe(map(x => new SearchTransactionResponse(x)));
	}

	getTransactionHierarchy(filter?: TransactionHierarchyFilter): Observable<TransactionHierarchyEntry[]> {
		const params = this.getHttpParams(filter);
		return this.httpClient
			.get<TransactionHierarchyEntry[]>(
				this.url + 'transactionHierarchy',
				params
			)
			.pipe(map(x => x.map(y => new TransactionHierarchyEntry(y))));
	}

	createCorrection(correction: Correction): Observable<any> {
		return this.httpClient.put(
			this.url + 'correction/' + correction.TransactionId,
			correction
		);
	}

	revertCorrections(transactionId: number): Observable<any> {
		return this.httpClient.delete(
			this.url + 'revertcorrections/' + transactionId
		);
	}

	resubmitTransactions(request: ResubmitTransactionRequest): Observable<any> {
		//const params = this.getHttpParams(request);
		return this.httpClient.post(this.url + 'resubmittransactions', request);
	}

	private getHttpParams(filter?: object): {} {
		let params = new HttpParams();
		if (filter) {
			Object.keys(filter)
				.filter(property => !property.startsWith('_'))
				.forEach(property => {
					const value = (<any>filter)[property];
					if (value !== null && value !== undefined) {
						params = params.append(property, `${value}`);
					}
				});
		}
		return { params };
	}
}
