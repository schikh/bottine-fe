import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AccountService, UserInfo } from './account.service';

@Injectable({
	providedIn: 'root'
})
export class AuthorizationGuard implements CanActivate {
	constructor(private accountService: AccountService, private router: Router) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : boolean {
		const redirectUrl = (<any>route)['_routerState']['url'];

		if (!this.accountService.isLogged) {
			this.redirectToLoginPage(redirectUrl);
			return false;	
		}

		if (this.accountService.userInfo.Reader && redirectUrl !== '/reports/generation') {
			this.router.navigate(['/reports/generation']);
			return false;
		}

		return this.hasAccess(redirectUrl, this.accountService.userInfo);
	}

	redirectToLoginPage(redirectUrl: string) {
		this.router.navigateByUrl(
			this.router.createUrlTree(['/login'], {
				queryParams: {
					redirectUrl
				}
			})
		);
	}

	hasAccess(url: string, userInfo: UserInfo) {
		return this.accountService.userInfo.Reader
			|| this.accountService.userInfo.Agent
			|| this.accountService.userInfo.Supervisor
			|| this.accountService.userInfo.ItSupport;
	}
}
