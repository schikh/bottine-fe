import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService, UserInfo } from '../account/account.service';

@Component({
	selector: 'xyz-header',
	template: `
<nav class="navbar navbar-expand navbar-dark bg-dark navbar-custom ">
	<a class="navbar-brand" routerLink="">
		Talexus<span style="font-size: 16px;"> - Corrections Manuelles</span>
	</a>
	<div class="collapse navbar-collapse">
		<ul class="navbar-nav" *ngIf="isLogged">
			<li class="nav-item mr-auto" *ngIf="canEdit">
				<a class="nav-link" routerLink="transaction/search" routerLinkActive="active">Transactions</a>
			</li>
			<li class="nav-item mr-auto" *ngIf="canEdit">
				<a class="nav-link" routerLink="correction/search" routerLinkActive="active">Corrections</a>
			</li>
			<li class="nav-item mr-auto" *ngIf="canEdit">
				<a class="nav-link" routerLink="device/search" routerLinkActive="active">Compteurs</a>
			</li>
			<li class="nav-item mr-auto" *ngIf="canEdit">
				<a class="nav-link" routerLink="manualtransaction/search" routerLinkActive="active">Ristournes</a>
			</li>
			<li class="nav-item mr-auto" *ngIf="canRead">
				<a class="nav-link" routerLink="reports/generation" routerLinkActive="active">Rapports</a>
			</li>
		</ul>
		<ul class="navbar-nav ml-auto">
			<li class="nav-item" *ngIf="isLogged">
				<div class="d-inline-block" ngbDropdown display="dynamic" placement="bottom-right" #dropdown="ngbDropdown">
					<a class="nav-item nav-link" ngbDropdownAnchor (click)="dropdown.toggle();">
						<i class="fa fa-user-circle fa-lg mr-2"></i>
						{{ accountService.userInfo.UserId }} ({{ role }})
					</a>
					<div class="p-0" ngbDropdownMenu>
						<xyz-change-password (closeComponent)="dropdown.close()">
						</xyz-change-password>
					</div>
				</div>

			</li>
			<li class="nav-item">
				<a class="nav-item nav-link" routerLink="" (click)="logout()" ngbTooltip="Déconnexion" placement="bottom">
					<i class="fa fa-sign-out-alt fa-lg"></i>
				</a>
			</li>
		</ul>
	</div>
</nav>
	`
})
export class HeaderComponent {

	constructor(
		public accountService: AccountService,
		private router: Router
	) {
	}

	@ViewChild('dropdown', {static: true}) dropdown: any;

	get isLogged(): boolean {
		return this.accountService.isLogged;
	}

	get canEdit(): boolean {
		return this.accountService.userInfo.canEdit;
	}

	get canRead(): boolean {
		return this.accountService.userInfo.canRead;
	}

	get role(): string {
		const userInfo = this.accountService.userInfo;
		if (userInfo.ItSupport) {
			return 'Support IT';
		} else if (userInfo.Supervisor) {
			return 'Superviseur';
		} else if (userInfo.Agent) {
			return 'Agent';
		} else {
			return 'Lecteur';
		}
	}

	logout() {
		this.accountService.logout().subscribe(
			r => {
				this.router.navigateByUrl('/login');
			}
		);
	}

	close() {
		this.dropdown.close();
	}
}
