import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { TransactionsFilter, Supplier, Distributor } from '../model';

@Component({
	selector: 'xyz-search-panel',
	template: `
<form #form="ngForm">

<div class="form-group"><label>ARN        </label><input type="text" class="form-control" [(ngModel)]="model.ARN" name="ARN"></div>
<div class="form-group">
	<label>EAN(s)</label>
	<textarea class="form-control" cols="2" rows="3" [(ngModel)]="model.EAN" name="EAN"></textarea>
</div>
<div class="form-group">
	<label>Référence fichier</label>
	<input type="text" class="form-control" [(ngModel)]="model.FILE_REF" name="FILE_REF">
</div>

<div class="form-group">
    <label>N° de ligne</label>
    <input type="text" numbersOnly maxlength="9" class="form-control" [(ngModel)]="model.LINE_ID" name="LINE_ID" >
</div>

<div class="form-group">
	<label>Date de début</label>
	<div class="input-group">
		<input class="form-control" type="text" [(ngModel)]="model.BeginDate" validate-date id="BeginDate"
			name="BeginDate"  #BeginDate="ngModel" placeholder="__/__/____" />
	</div>
	<div class="error-message" *ngIf="BeginDate.errors && (BeginDate.dirty || BeginDate.touched)">
		<p *ngIf="BeginDate.errors.validateDate">Date invalide</p>
	</div>
</div>

<div class="form-group">
	<label>Date de fin</label>
	<div class="input-group">
		<input class="form-control" type="text" [(ngModel)]="model.EndDate" validate-date id="EndDate"
			name="EndDate"  #EndDate="ngModel" placeholder="__/__/____" />
	</div>
	<div class="error-message" *ngIf="EndDate.errors && (EndDate.dirty || EndDate.touched)">
		<p *ngIf="EndDate.errors.validateDate">Date invalide</p>
	</div>
</div>

<div class="form-group">
	<label>Fournisseur</label>
	<select	class="form-control" [(ngModel)]="model.SUPPLIER_ID" name="SUPPLIER_ID">
		<option [value]=""></option>
		<option *ngFor="let item of suppliers$ | async" [value]="item.Id">
			{{ item.getDescription() }}
		</option>
	</select>
</div>

<div class="form-group">
	<label>GRD</label>
	<select	class="form-control" [(ngModel)]="model.GRD_ID" name="GRD_ID">
		<option [value]=""></option>
		<option *ngFor="let item of distributors$ | async" [value]="item.Id">
			{{ item.getDescription() }}
		</option>
	</select>
</div>

<div class="form-group">
	<div class="d-flex justify-content-between">
		<label>Energie:</label>
		<div class="custom-control custom-switch">
			<input type="checkbox" class="custom-control-input" id="ENERGY-E" name="ENERGY-E"
				[ngModel]="model.ENERGY === 'E'"
				(click)="model.ENERGY = model.ENERGY === 'E' ? null : 'E'">
			<label class="custom-control-label pointer" for="ENERGY-E">Electricité</label>
		</div>
		<div class="custom-control custom-switch">
			<input type="checkbox" class="custom-control-input" id="ENERGY-G" name="ENERGY-G"
				[ngModel]="model.ENERGY === 'G'"
				(click)="model.ENERGY = model.ENERGY === 'G' ? null : 'G'">
			<label class="custom-control-label pointer" for="ENERGY-G">Gaz</label>
		</div>
	</div>
</div>

<hr>

<div class="form-group">
	<div class="d-flex justify-content-between">
		<button type="button" class="btn btn-primary" style="width:100px" (click)="run()" [disabled]="!form.valid">Recherche</button>
		<button type="button" class="btn btn-primary" style="width:100px" (click)="clear()">Effacer</button>
	</div>
</div>

</form>
`
})
export class SearchPanelComponent {

	@Input()
	model: TransactionsFilter;

	@Input()
	suppliers$: Observable<Supplier[]>;

	@Input()
	distributors$: Observable<Distributor[]>;

	@Output()
	executeSearch = new EventEmitter();

	@Output()
	clearSearch = new EventEmitter();

	run(): void {
		this.executeSearch.emit();
	}

	clear(): void {
		this.clearSearch.emit();
    }
}
