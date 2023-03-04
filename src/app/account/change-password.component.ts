import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { DialogService } from '../shared/dialog.service';
import { AccountService } from './account.service';

@Component({
	selector: 'xyz-change-password',
	template: `
<form #form="ngForm">
	<div class="card" style="margin: auto; width: 300px;">
		<div class="card-body">
			<h5 class="card-title">Modifier le mot de passe</h5>
			<div class="form-group">
				<label>Mot de passe actuel</label>
				<input
					#oldPasswordField="ngModel"
					name="oldPassword"
					type="password"
					class="form-control"
					[(ngModel)]="oldPassword"
					required
				/>
			</div>
			<div class="error-message" *ngIf="oldPasswordField?.errors && (oldPasswordField.dirty || oldPasswordField.touched)">
				<p *ngIf="oldPasswordField.errors.required">Mot de passe actuel requis.</p>
				<p *ngIf="oldPasswordField.errors.pattern">Mot de passe actuel invalid.</p>
			</div>
			<div class="form-group">
				<label>Nouveau mot de passe</label>
				<input
					#newPassword1Field="ngModel"
					name="newPassword1"
					type="password"
					class="form-control"
					[(ngModel)]="newPassword1"
					required
					minlength="8"
				/>
			</div>
			<div class="error-message" *ngIf="newPassword1Field?.errors && (newPassword1Field.dirty || newPassword1Field.touched)">
				<p *ngIf="newPassword1Field.errors.required">Mot de passe requis.</p>
				<p *ngIf="newPassword2Field.errors.minlength">Mot de passe doit avoir au moins 8 caractères.</p>
			</div>

			<div class="form-group">
				<label>Confirmer le nouveau mot de passe</label>
				<input
					#newPassword2Field="ngModel"
					name="newPassword2"
					type="password"
					class="form-control"
					[(ngModel)]="newPassword2"
					required
					minlength="8"
					[pattern]="escapeRegExp(newPassword1)"
				/>
			</div>
			<div class="error-message" *ngIf="newPassword2Field?.errors && (newPassword2Field.dirty || newPassword2Field.touched)">
				<p *ngIf="newPassword2Field.errors.required">Mot de passe requis.</p>
				<p *ngIf="newPassword2Field.errors.pattern">Mot de passe ne correspond pas.</p>
			</div>
			
			<div class="float-right">
				<button class="btn btn-primary" [disabled]="!form.valid" (click)="update()">
					Modifier
				</button>
				<button class="btn btn-primary ml-3 " (click)="close()">
					Annuler
				</button>
			</div>
		</div>
	</div>
</form>
	`
})
export class ChangePasswordComponent {

	oldPassword: string;
	newPassword1: string;
	newPassword2: string;

	@Output() closeComponent = new EventEmitter<any>();
	@ViewChild('form', { static: true }) form: any;

	constructor(
		public accountService: AccountService,
		private dialogService: DialogService
	) {}

	update(): void {
		this.accountService.changePassword(this.oldPassword, this.newPassword1).subscribe(
			r => {
				this.dialogService.success('Mot de passe changé');
				this.close();
			},
			r => {
				this.dialogService.error('Error lors du changement du mot de passe');
				this.oldPassword = null;
			}
		);
	}

	close(): void {
		this.form.reset();
		this.closeComponent.emit();
	}

	escapeRegExp(text: string): string {
		return text && text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
	}
}
