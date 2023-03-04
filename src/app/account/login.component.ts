import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from '../shared/dialog.service';
import { AccountService } from './account.service';

@Component({
	template: `
<div class="main-area-container">
	<div class="main-area d-flex justify-content-center align-items-center">
		<div class="card" style="width: 500px;">
			<div class="card-body">
				<h5 class="card-title">Identification</h5>
				<div class="form-group">
					<label>Compte</label>
					<input
						type="text"
						class="form-control"
						[(ngModel)]="userId"
					/>
				</div>
				<div class="form-group">
					<label>Mot de passe</label>
					<input
						type="password"
						class="form-control"
						[(ngModel)]="password"
					/>
				</div>
				<button type="submit" class="btn btn-primary" (click)="tryLogin()">
					Login
				</button>
			</div>
		</div>
	</div>
</div>
	`
})
export class LoginPageComponent {

	userId: string;
	password: string;

	constructor(
		private accountService: AccountService,
		private dialogService: DialogService,
		private router: Router
	) {}

	tryLogin() {
		this.accountService.login(this.userId, this.password).subscribe(
			r => {
				this.router.navigateByUrl('/');
			},
			e => {
				this.dialogService.error('Compte ou mot de passe incorrect');
			}
		);
	}
}
