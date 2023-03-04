import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SortableTableHeaderDirective, SortEvent } from 'src/app/utils/sortable-table-header.directive';
import { Transaction, TransactionsFilter } from '../model';
import { AccountService } from 'src/app/account/account.service';

@Component({
	selector: 'xyz-search-result',
	template: `
<table class="table table-striped table-hover pointer table-headers-fix">
	<thead>
		<tr class="table-primary">
			<th width="32px" *ngIf="showTransactionSelection">
				<input type="checkbox"
				[(ngModel)]="allSelected"
    			(change)="selectAll()">
			</th>
			<th sortable="CORRECTION_LEVEL" (sort)="onSort($event)" width="32px"></th>
			<th sortable="RECORD_TYPE"      (sort)="onSort($event)">Status</th>
			<th sortable="FILE_REF"         (sort)="onSort($event)">Référence fichier</th>
			<th sortable="LINE_ID"          (sort)="onSort($event)">N° de ligne     </th>
			<th sortable="EAN"              (sort)="onSort($event)">EAN             </th>
			<th sortable="amount"           (sort)="onSort($event)">Montant (€)     </th>
			<th sortable="AMOUNT_TYPE"      (sort)="onSort($event)">Type            </th>
			<th sortable="ENERGY"           (sort)="onSort($event)">Energie         </th>
			<th sortable="ARN"              (sort)="onSort($event)">ARN             </th>
			<th sortable="SUPPLIER_ID"      (sort)="onSort($event)">Fournisseur     </th>
			<th sortable="GRD_ID"           (sort)="onSort($event)">GRD             </th>
			<th sortable="TIME_STAMP"       (sort)="onSort($event)">Date et heure de chargement</th>
			<th sortable="TRANS_NUM"        (sort)="onSort($event)">N° de transaction</th>
			<th sortable="F_TRANS_MAN"      (sort)="onSort($event)">Ristourne</th>
			</tr>
	</thead>
	<tbody>
		<tr *ngFor="let item of sortedTransactions$ | async" (click)="viewDetail(item.PKEY, $event)">
			<td width="32px" *ngIf="showTransactionSelection" (click)="$event.stopPropagation()">
				<input type="checkbox" [(ngModel)]="item.selected" (click)="$event.stopPropagation()">
			</td>
			<td>
				<div *ngIf="item.CORRECTION_LEVEL">
					<i class="far fa-file-alt fa-lg"></i>
				</div>
			</td>
			<td>{{ item.statusDescription() }}</td>
			<td class="alignright">{{ item.FILE_REF         }}</td>
			<td class="alignright">{{ item.LINE_ID          }}</td>
			<td>{{ item.EAN              }}</td>
			<td class="alignright">{{ item.amount | numberformat }}</td>
			<td>{{ item.type             }}</td>
			<td>{{ item.ENERGY           }}</td>
			<td>{{ item.ARN              }}</td>
			<td>{{item.SUPPLIER_ID}} - {{item.SUPPLIER_NAME}} </td>
			<td>{{item.GRD_ID}} - {{item.DISTRIBUTOR_NAME}} </td>
			<td>{{ item.TIME_STAMP | stringToDate | date:'dd/MM/yyyy HH:mm:ss' }}</td>
			<td class="alignright">{{ item.TRANS_NUM        }}</td>
			<td class="aligncenter">
				<span class="fa-stack" style="font-size: 0.8em; color: #007bff;" *ngIf="item.F_TRANS_MAN == 'Y'">
					<i class="fas fa-circle fa-stack-2x"></i>
					<i class="fas fa-euro-sign fa-stack-1x fa-inverse"></i>
			  	</span>
			</td>
		</tr>
	</tbody>
</table>
`
})
export class SearchResultComponent implements OnInit {

	constructor(private router: Router, private accountService: AccountService) { }

	allSelected: boolean;

	@Input()
	resend: boolean = false;

	@Input()
	model: TransactionsFilter;

	@Input()
	transactions$: Observable<Transaction[]>;

	@ViewChildren(SortableTableHeaderDirective)
	headers: QueryList<SortableTableHeaderDirective>;

	sortedTransactions$: Observable<Transaction[]>;

	ngOnInit() {
		this.sortedTransactions$ = this.transactions$;
	}

	onSort({column, direction}: SortEvent) {
		this.headers.forEach(header => {
			if (header.sortable !== column) {
				header.direction = '';
			}
		});

		const comparer = (obj1: Transaction, obj2: Transaction) => {
			const v1 = (column === 'amount' ? obj1.amount : (<any>obj1)[column]) || '';
			const v2 = (column === 'amount' ? obj2.amount : (<any>obj2)[column]) || '';
			const res = v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
			return direction === 'asc' ? res : -res;
		};

		if (direction === '') {
			this.sortedTransactions$ = this.transactions$;
		} else {
			this.sortedTransactions$ = this.transactions$
				.pipe(map(x => [...x].sort(comparer)));
		}
	}

	viewDetail(id: number, $event: any) {
		$event.stopPropagation();
		this.router.navigateByUrl('/transaction/hierarchy/' + id);
	}

	selectAll(): void {
		this.sortedTransactions$.subscribe(
			transactions => transactions.forEach(t => t.selected = this.allSelected)
		);
	}

	get showTransactionSelection() {
		return  this.resend && this.accountService.userInfo.ItSupport;
	}
}
