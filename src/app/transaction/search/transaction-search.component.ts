import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, startWith, switchMap, shareReplay, tap } from 'rxjs/operators';
import { DeviceService } from 'src/app/device/device.service';
import { Distributor, Supplier, Transaction, TransactionsFilter, ResubmitTransactionRequest } from '../model';
import { TransactionService } from '../transaction.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { LocalStorageService } from 'src/app/shared/local-storage.service';
import { AccountService } from 'src/app/account/account.service';

@Component({
	template: `
<div class="d-flex">
	<h1 class="my-3">Transactions</h1>
	<div class="form-group form-inline ml-auto mt-auto">
		<label class="mr-3">Filtrer le résultat:</label>
		<div class="input-group">
			<input class="form-control" type="text" [(ngModel)]="filter" (keyup)="onFilterChange($event.code)"/>
			<div class="input-group-append">
				<button type="button" class="btn btn-primary" (click)="clearFilter()" style="width: 40px;">
					<i class="fas fa-times-circle fa-lg"></i>
				</button>
			</div>
		</div>
	</div>
</div>

<div class="d-flex">
	<div class="card" style="width: 250px; min-width: 250px;">
		<div class="card-body">
			<xyz-search-panel
				[model]="model"
				[suppliers$]="suppliers$"
				[distributors$]="distributors$"
				(executeSearch)="onExecuteSearch()"
				(clearSearch)="onClearSearch()">
			</xyz-search-panel>
		</div>
	</div>
	<div class="flex-grow-1 ml-3 flex-column">
		<div class="search-result-table-area">
			<xyz-search-result [model]="model" [transactions$]="transactions$" [resend]="true">
			</xyz-search-result>
		</div>
		<div class="d-flex justify-content-between mt-3">
			<div class="btn-group" role="group">
				<button type="button" class="btn btn-outline-primary" style="width: 160px"
					(click)="previousPage()" [disabled]="!model.previousPageAvailable">
					<i class="fas fa-caret-left fa-lg mr-1"></i>
					Page précédente
				</button>
				<button type="button" class="btn btn-muted" style="width: 150px">Page {{model.page}} \\ {{model.totalPages}}</button>
				<button type="button" class="btn btn-outline-primary" style="width: 160px"
					(click)="nextPage()" [disabled]="!model.nextPageAvailable">
					Page suivante
					<i class="fas fa-caret-right fa-lg ml-1"></i>
				</button>
				<button type="button" class="btn btn-success ml-5" style="width: 160px"
					(click)="export()">
					<i class="far fa-file-excel fa-lg mr-2"></i>Exporter
				</button>

				<button type="button" class="btn btn-warning ml-5" style="width: 160px"
					*ngIf="canResubmitTransactions"
					(click)="resubmit()">
					<i class="fas fa-upload fa-lg mr-2"></i>Réenvoyer
				</button>
			</div>

			<select class="custom-select" style="width: auto" [(ngModel)]="model.pageSize">
				<option [ngValue]="10">10 transactions par page</option>
				<option [ngValue]="50">50 transactions par page</option>
				<option [ngValue]="100">100 transactions par page</option>
				<option [ngValue]="200">200 transactions par page</option>
			</select>
		</div>
	</div>
</div>
`
})
export class TransactionSearchComponent implements OnInit {

	constructor(
		private transactionService: TransactionService,
		private deviceService: DeviceService,
		private dialogService: DialogService,
		private localStorageService: LocalStorageService,
		private accountService: AccountService
	) {}

	transactions$: Observable<Transaction[]>;
	model: TransactionsFilter;
	suppliers$: Observable<Supplier[]>;
	distributors$: Observable<Distributor[]>;
	inputChange$: Subject<string>;
	filter: string;

	ngOnInit(): void {
		this.restoreFilter();
		this.suppliers$ = this.deviceService.getSuppliers();
		this.distributors$ = this.deviceService.getDistributors();
		this.inputChange$ = new BehaviorSubject<string>('');

		const res = (searchText: string) => (item: Transaction) => {
			if (searchText === '' || !searchText) {
				return true;
			}
			const text = item.transactionToString().toLowerCase();
			const tokens = searchText.toLowerCase().split(' ');
			return tokens.every(t => text.includes(t));
		};

		const list$ = this.transactionService.getTransactions();

		list$.subscribe(
			(x: any) => this.calculatePagingInfo(x.TotalRecords)
		);

		this.transactions$ = list$.pipe(
			switchMap((x : any) =>
				this.inputChange$.pipe(
					map(search => x.Transactions.filter(res(search)))
				)
			),
			shareReplay(1)
		);
	}

	onExecuteSearch(): void {
		this.model.page = 1;
		this.executeSearch();
	}

	onClearSearch(): void {
		this.model.clear();
	}

	private calculatePagingInfo(totalRecords: number): void {
		const totalPages = Math.max(1, Math.ceil(totalRecords / this.model.pageSize));
		const previousPageAvailable = this.model.page > 1;
		const nextPageAvailable = this.model.page < totalPages;
		this.model.totalPages = totalPages;
		this.model.previousPageAvailable = previousPageAvailable;
		this.model.nextPageAvailable = nextPageAvailable;
	}

	private restoreFilter(): void {
		this.model = this.localStorageService.getTransactionsFilter();
	}

	private saveFilter(): void {
		this.localStorageService.saveTransactionsFilter();
	}

	previousPage(): void {
		this.model.previousPage();
		this.executeSearch();
	}

	nextPage(): void {
		this.model.nextPage();
		this.executeSearch();
	}

	private executeSearch(): void {
		this.saveFilter();
		this.transactionService.searchTransactions(this.model.clone());
	}

	onFilterChange(value: string): void {
		this.inputChange$.next(value);
	}

	clearFilter(): void {
		this.filter = '';
		this.onFilterChange('');
	}

	get canResubmitTransactions() {
		return  this.accountService.userInfo.ItSupport;
	}

	export(): void {
		this.transactionService.searchTransactions2(this.model.clone()).subscribe(
			(list: any) => {
				const rows = list.Transactions.map((x: any) => x.export());
			}
		);
	}

	resubmit(): void {
		this.transactions$
			.subscribe(transactions => this.resubmitTransactions(transactions))
			.unsubscribe();
	}

	private resubmitTransactions(transactions: Transaction[]): void {
		const selectedTransactions = transactions.filter(t => t.selected);
		if (selectedTransactions.length === 0) {
			this.dialogService.warning('Aucune transaction sélectionnée');
			return;
		}
		const request = new ResubmitTransactionRequest();
		request.TransactionIds = selectedTransactions
			.filter(t => t.TRANS_NUM !== 0)
			.map(t => t.TRANS_NUM);
		request.CorrectionIds = selectedTransactions
			.filter(t => t.TRANS_NUM === 0)
			.map(t => t.FTRANS_CORRECTION);
		this.transactionService.resubmitTransactions(request).subscribe(
			(result: any) => {
				this.dialogService.success(`${result} transactions ont été réenvoyées`);
			}
		);
	}
}
