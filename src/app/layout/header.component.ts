import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService, UserInfo } from '../account/account.service';

@Component({
	selector: 'xyz-header',
	template: `
<nav class="navbar navbar-expand-sm navbar-dark fixed-top bg-dark container">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">
      <h3>XXXXXXXXXXXX</h3>
    </a>
    <button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">

        <li class="nav-item">
          <a class="nav-link" routerLink="main/home">Home</a>
        </li>
        
		<li class="nav-item">
          <a class="nav-link" routerLink="blogpost/search">Blogs</a>
        </li>
        
		<li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Dropdown
          </a>
          <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><a class="dropdown-item" href="#">Action</a></li>
            <li><a class="dropdown-item" href="#">Another action</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#">Something else here</a></li>
          </ul>
        </li>
        
		<li class="nav-item">
          <a class="nav-link disabled" href="#" tabindex="-1">Disabled</a>
        </li>

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
      <!-- <form class="d-flex">
        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
        <button class="btn btn-outline-success" type="submit">Search</button>
      </form> -->
    </div>
  </div>
</nav>
	`
})
export class HeaderComponent {

	constructor(
		public accountService: AccountService,
		private router: Router
	) {}

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
