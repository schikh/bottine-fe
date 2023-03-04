import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export class UserInfo {

	public constructor(init?: Partial<UserInfo>) {
		Object.assign(this, init);
	}

	UserId!: string;
	Reader: boolean = false;
	Agent: boolean = false;
	Supervisor: boolean = false;
	ItSupport: boolean = false;
	ExpirationTimeStamp!: string;

	get canEdit() {
		return this.Agent || this.Supervisor || this.ItSupport;
	}

	get canEditDevice() {
		return this.Supervisor || this.ItSupport;
	}

	get canRead() {
		return this.Reader || this.canEdit;
	}
}

@Injectable({
	providedIn: 'root'
})
export class AccountService {
	private url = 'api/account/';
	private _userInfo: UserInfo;

	constructor(private httpClient: HttpClient) {}

	get userInfo(): UserInfo {
		if (!this._userInfo) {
			this._userInfo = this.restoreUserInfo();
		}
		return this._userInfo;
	}

	set userInfo(value: UserInfo) {
		this._userInfo = value;
		this.saveUserInfo(value);
	}

	get isLogged(): boolean {
		if (!this.userInfo) {
			return false;
		}
		const now = new Date().toISOString();
		return this.userInfo.ExpirationTimeStamp > now;
	}

	login(userId: string, password: string): Observable<any> {
		return this.httpClient
			.post<UserInfo>(this.url + 'login', {
				userId: userId,
				password: password
			})
			.pipe(tap(u => this.userInfo = new UserInfo(u)));
	}

	logout(): Observable<any> {
		return this.httpClient
			.post(this.url + 'logout', {})
			.pipe(tap(x => {
				this._userInfo = null;
			}));
	}

	changePassword(oldPassword: string, newPassword: string): Observable<any> {
		return this.httpClient
			.post(this.url + 'changePassword', { oldPassword, newPassword });
	}

	private restoreUserInfo(): UserInfo {
		const json = localStorage.getItem('UserInfo');
		return json ? new UserInfo(JSON.parse(json)) : null;
	}

	private saveUserInfo(userInfo: UserInfo): void {
		const value = userInfo ? JSON.stringify(userInfo) : null;
		localStorage.setItem('UserInfo', value);
	}
}
