import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReplaySubject } from 'rxjs';
import { DialogService } from 'src/app/shared/dialog.service';
import { TransactionEditComponent } from '../edit/transaction-edit.component';
import { TransactionHierarchyFilter, TransactionHierarchyNode } from '../model';
import { TransactionService } from '../transaction.service';
import { TransactionHierarchyService } from './transaction-hierarchy.service';

@Component({
	selector: 'xyz-transactions-hierarchy',
	template: `
<div class="d-flex align-items-center">
	<div class="flex-grow-1">
		<h1 class="my-3">Historique des corrections</h1>
	</div>
	<div>
		<button class="btn btn-link" routerLink="/transactions/search" style="width: 50px;">
		<i class="fas fa-arrow-alt-circle-up fa-2x"></i>
		</button>
	</div>
</div>
<div class="search-result-table-area">
<table class="table table-striped table-hover pointer table-headers-fix tree" style="font-size: 12px;">
	<thead>
		<tr class="table-primary">
			<th style="width: 0px;" [attr.colspan]="maxLevel" ></th>
			<th>Niveau</th>
			<th>Status</th>
			<!--
			<th>ID</th>
			<th>PARENT ID</th>
			-->
			<th>Référence fichier</th>
			<th>N° de ligne     </th>
			<th>EAN             </th>
			<th>Montant (€)     </th>
			<th>Type            </th>
			<th>Energie         </th>
			<th>ARN             </th>
			<th>Fournisseur     </th>
			<th>GRD             </th>
			<th>Date et heure de chargement</th>
			<th>Utilisateur     </th>
			<th style="width: 0;"></th>
		</tr>
	</thead>
	<tbody>
		<tr *ngFor="let node of TransactionHierarchyNodes$ | async"
			[ngClass]="{
				'text-danger': node.error,
				'table-warning': node.entry.ID === id && node !== selectedNode,
				'table-info': node === selectedNode
			}"
			(click)="this.selectedNode = node">

			<td style="padding:0; width:20px; border-right:0 !important;" *ngFor="let box of node.boxes">
				<ng-container [ngSwitch]="box">
					<ng-container *ngSwitchCase="1">
						<svg width="21px" height="36px" viewBox="0 0 100 150" preserveAspectRatio="none">
						    <rect x="25" y="50" width="50" height="50" stroke="black" stroke-width="5" fill="lightgrey" />
						</svg>
					</ng-container>
					<ng-container *ngSwitchCase="2">
						<svg width="21px" height="36px" viewBox="0 0 100 150" preserveAspectRatio="none">
						    <rect x="25" y="50" width="50" height="50" stroke="black" stroke-width="5" fill="none" />
						</svg>
					</ng-container>
					<ng-container *ngSwitchCase="3">
						<svg width="21px" height="36px" viewBox="0 0 100 150" preserveAspectRatio="none">
							<path d="M 50 0 l 0 75" />
							<path d="M 50 75 l 50 0" />
						</svg>
					</ng-container>
					<ng-container *ngSwitchCase="4">
						<svg width="21px" height="36px" viewBox="0 0 100 150" preserveAspectRatio="none">
							<path d="M 50 0 l 0 150" />
							<path d="M 50 75 l 50 0" />
						</svg>
					</ng-container>
					<ng-container *ngSwitchCase="5">
						<svg width="21px" height="36px" viewBox="0 0 100 150" preserveAspectRatio="none">
							<path d="M 50 0 l 0 150" />
						</svg>
					</ng-container>
				</ng-container>
			</td>

			<td class="alignright">{{ node.entry.CORRECTION_LEVEL }}</td>
			<td>{{ node.entry.statusDescription() }}</td>
			<!--
			<td class="alignright">{{ node.entry.ID               }}</td>
			<td class="alignright">{{ node.entry.PARENT_ID        }}</td>
			-->
			<td class="alignright">{{ node.entry.FILE_REF         }}</td>
			<td class="alignright">{{ node.entry.LINE_ID          }}</td>
			<td>{{ node.entry.EAN              }}</td>
			<td class="alignright">{{ node.entry.amount | numberformat  }}</td>
			<td>{{ node.entry.type             }}</td>
			<td>{{ node.entry.ENERGY           }}</td>
			<td>{{ node.entry.ARN              }}</td>
			<td>{{node.entry.SUPPLIER_ID}} - {{node.entry.SUPPLIER_NAME}} </td>
			<td>{{node.entry.GRD_ID}} - {{node.entry.DISTRIBUTOR_NAME}} </td>
			<td>{{ node.entry.TIME_STAMP | stringToDate | date:'dd/MM/yyyy HH:mm:ss' }}</td>
			<td>{{ node.entry.USERID | uppercase }}</td>
			<td style="padding:0; width: 1px;">
				<button type="button" class="btn btn-primary" title="Corriger la transaction"
					*ngIf="node.reversible"
					(click)="editTransaction(node, $event)"
					style="width: 37px; height: 36px">
					<i class="fas fa-pencil-alt fa-lg"></i>
				</button>
				<button type="button" class="btn btn-warning" title="Annuler la correction"
					*ngIf="node.cancelable"
					(click)="revertCorrections(node, $event)"
					style="width: 37px; height: 36px">
					<i class="fas fa-times-circle fa-lg"></i>
				</button>
			</td>
		</tr>
	</tbody>
</table>
</div>
<div class="d-flex justify-content-between mt-3">
	<button type="button" class="btn btn-success" style="width: 160px"
		(click)="export()">
		<i class="far fa-file-excel fa-lg mr-2"></i>Exporter
	</button>
</div>
`
})
export class TransactionHierarchyComponent implements OnInit {

	constructor(
		private transactionService: TransactionService,
		private transactionHierarchyService: TransactionHierarchyService,
		private activatedRoute: ActivatedRoute,
		private modalService: NgbModal,
		private dialogService: DialogService) {
	}

	TransactionHierarchyNodes$ = new ReplaySubject<TransactionHierarchyNode[]>(1);
	id: number;
	selectedNode: any;
	maxLevel: number;

	ngOnInit() {
		this.parseRouteParameters();
		this.getTransactionHierarchy();
	}

	editTransaction(node: TransactionHierarchyNode, $event: any): void {
		$event.stopPropagation();
		this.selectedNode = node;
		const modalRef = this.modalService.open(TransactionEditComponent, {
			size: 'sm'
		});
		const modalComponent = modalRef.componentInstance;
		const correction = node.entry.getCorrection();

		// Hack: format number with comma decimal separator
		if (typeof correction.AMOUNT === 'number') {
			correction.AMOUNT = <any> correction.AMOUNT.toFixed(2).replace('.', ',');
		}

		modalComponent.model = correction;
		modalRef.result.then(result => {
			this.getTransactionHierarchy();
		});
	}

	revertCorrections(node: TransactionHierarchyNode, $event: any): void {
		$event.stopPropagation();
		this.dialogService.confirm('Information', 'Suprimer la correction ?')
			.then(result => result && this.revert(node));
	}

	export(): void {
		const filter = new TransactionHierarchyFilter();
		filter.ID = this.id;
		this.transactionService.getTransactionHierarchy(filter)
			.subscribe(
				(list: any) => {
					const rows = list.map((x: any) => x.export());
				}
			);
	}

	private revert(node: TransactionHierarchyNode): void {
		this.transactionService.revertCorrections(node.entry.PARENT_ID)
			.subscribe(
				(_ : any) => {
					this.dialogService.success('Correction suprimée');
					this.getTransactionHierarchy();
				}
			);
	}

	private parseRouteParameters() {
		this.id = parseInt(this.activatedRoute.snapshot.paramMap.get('id'), 10);
	}

	private getTransactionHierarchy() {
		const filter = new TransactionHierarchyFilter();
		filter.ID = this.id;
		this.transactionService.getTransactionHierarchy(filter)
			.subscribe(
				(entries: any) => {
					const list = this.transactionHierarchyService.create(entries);
					this.maxLevel = this.transactionHierarchyService.getMaxLevel(list) + 1;
					this.TransactionHierarchyNodes$.next(list);
				}
			);
	}
}
