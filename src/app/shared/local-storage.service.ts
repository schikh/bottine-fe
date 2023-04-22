import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

	private transactionsFilterKey = 'TransactionsFilter';

	private list = {
		transactionsFilter: undefined as any
	};

	// getTransactionsFilter(): TransactionsFilter {
	// 	if (this.list.transactionsFilter === undefined) {
	// 		const value = localStorage.getItem(this.transactionsFilterKey);
	// 		const filter = new TransactionsFilter('T', JSON.parse(value));
	// 		filter.page = 1;
	// 		filter.totalPages = 1;
	// 		this.list.transactionsFilter = filter;
	// 	}
	// 	return this.list.transactionsFilter;
	// }

	saveTransactionsFilter(): void {
		localStorage.setItem(this.transactionsFilterKey, JSON.stringify(this.list.transactionsFilter));
	}
}
