import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { DeviceService } from 'src/app/device/device.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { Correction, Distributor, Supplier } from '../model';
import { TransactionService } from '../transaction.service';

@Component({
	template: `
<form #MyForm="ngForm">

	<div class="modal-header">
		<h2 class="m-3">Corriger la transaction</h2>
		<button type="button" class="close" aria-label="Close" (click)="cancel()">
			<span>&times;</span>
		</button>
	</div>

	<div class="modal-body">
		<div class="form-group row">
			<label class="col-3 col-form-label alignright">Montant (€)</label>
			<div class="col-7">
				<input type="text" class="form-control"
					name="amountInput"
					[(ngModel)]="model.AMOUNT"
					[disabled]="!amountOpened"
					required
                    validate-number />
			</div>
			<div class="col-1" class="custom-control custom-switch mt-2">
				<input type="checkbox" class="custom-control-input"
					name="amountCheckBox"
					id="amountCheckBox"
					[(ngModel)]="amountOpened"
					(change)="selected($event)"
					value="AMOUNT">
				<label class="custom-control-label" for="amountCheckBox"></label>
			</div>
		</div>

		<div class="form-group row">
			<label class="col-3 col-form-label alignright">EAN</label>
			<div class="col-7">
				<input type="text" class="form-control"
				name="eanInput"
				[(ngModel)]="model.EAN"
				[disabled]="!eanOpened"
				required />
			</div>
			<div class="col-1" class="custom-control custom-switch mt-2">
				<input type="checkbox" class="custom-control-input"
					name="eanCheckBox"
					id="eanCheckBox"
					[(ngModel)]="eanOpened"
					(change)="selected($event)"
					value="EAN,ARN">
				<label class="custom-control-label" for="eanCheckBox"></label>
			</div>
		</div>

		<div class="form-group row">
			<label class="col-3 col-form-label alignright">ARN</label>
			<div class="col-7">
				<input type="text" class="form-control"
					name="arnInput"
					[(ngModel)]="model.ARN"
					[disabled]="!eanOpened"
					required />
			</div>
		</div>

		<div class="form-group row">
			<label class="col-3 col-form-label alignright">Fournisseur</label>
			<div class="col-7">
				<select	class="form-control"
						name="supplierSelect"
						[(ngModel)]="model.SUPPLIER_ID"
						[disabled]="!supplierOpened"
						required >
					<option [ngValue]="null"></option>
					<option *ngFor="let item of suppliers$ | async" [value]="item.Id">
						{{ item.getDescription() }}
					</option>
				</select>
			</div>
			<div class="col-1" class="custom-control custom-switch mt-2">
				<input type="checkbox" class="custom-control-input"
					name="supplierCheckBox"
					id="supplierCheckBox"
					[(ngModel)]="supplierOpened"
					(change)="selected($event)"
					value="SUPPLIER_ID">
				<label class="custom-control-label" for="supplierCheckBox"></label>
			</div>
		</div>

		<div class="form-group row">
			<label class="col-3 col-form-label alignright">GRD</label>
			<div class="col-7">
				<select	class="form-control"
						name="grdSelect"
						[(ngModel)]="model.GRD_ID"
						[disabled]="!grdOpened"
						required >
					<option [ngValue]="null"></option>
					<option *ngFor="let item of distributors$ | async" [value]="item.Id">
						{{ item.getDescription() }}
					</option>
				</select>
			</div>
			<div class="col-1" class="custom-control custom-switch mt-2">
				<input type="checkbox" class="custom-control-input"
					name="grdCheckBox"
					id="grdCheckBox"
					[(ngModel)]="grdOpened"
					(change)="selected($event)"
					value="GRD_ID">
				<label class="custom-control-label" for="grdCheckBox"></label>
			</div>
		</div>
	</div>

	<div class="modal-footer">
		<button type="button" class="btn btn-primary" [disabled]="!dirty || !MyForm.valid" (click)="apply()">Appliquer</button>
		<button type="button" class="btn btn-danger" (click)="cancel()">Annuler</button>
	</div>

</form>
	`,
	styles: [`
		.form-control.ng-touched.ng-invalid{
			border-color: red;
		}
	`],
})
export class TransactionEditComponent implements OnInit {

	constructor(
		private activeModal: NgbActiveModal,
		private transactionService: TransactionService,
		private deviceService: DeviceService,
		private dialogService: DialogService
	) { }

	private modelCopy: Correction;
	model: Correction;
	suppliers$: Observable<Supplier[]>;
	distributors$: Observable<Distributor[]>;

	amountOpened = false;
	eanOpened = false;
	supplierOpened = false;
	grdOpened = false;

	ngOnInit() {
		this.modelCopy = this.model.clone();
		this.suppliers$ = this.deviceService.getSuppliers();
		this.distributors$ = this.deviceService.getDistributors();
	}

	apply(): void {
		const model = this.model.clone();

		const amount: any = model.AMOUNT;
		if (typeof amount === 'string') {
			model.AMOUNT = parseFloat(amount.replace(',', '.'));
		}

		this.transactionService.createCorrection(model).subscribe(
			() => {
				this.dialogService.success('Correction ajoutée');
				this.activeModal.close(true);
			},
			(error: any) => {
				error = error.error || error;
				const message = error.ExceptionMessage || error.message || error.Message;
				this.dialogService.error(message, 'Erreur technique');
				this.activeModal.close(false);
			}
		);
	}

	cancel(): void {
		this.activeModal.close(false);
	}

	selected($event: any) {
		const m: any = this.model;
		const c: any = this.modelCopy;
		if (!$event.target.checked) {
			$event.target.value.split(',')
				.forEach((p: string) => m[p] = c[p]);
		}
	}

	get dirty(): boolean {
		const m: any = this.model;
		const c: any = this.modelCopy;
		return Object.keys(this.model).some(p => m[p] !== c[p]);
	}
}
