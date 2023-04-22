import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { FacebookLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';

export class UserInfo {

    public constructor(init?: Partial<UserInfo>) {
        Object.assign(this, init);
    }

    name: string;
    email: string;
    authToken: string;
    createdAt: number;

    get canEdit() {
        return true;
    }

    get canRead() {
        return true;
    }
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private _loggedIn$ = new BehaviorSubject<boolean>(false);
    private _user: UserInfo;

    constructor(private socialAuthService: SocialAuthService) { 
        this.subscribeToAuthService();
        this._user = this.getUser();
    }

    authStatus = this._loggedIn$.asObservable();

    get isLogged(): boolean {
        return !!this._user;
    }

    get user(): UserInfo {
        return this._user;
    }

    set(user: UserInfo): void {
        this.saveUser(user);
        this._user = user;
        this._loggedIn$.next(!!user);
    }

    logout(): void {
        this.set(null);
        this.socialAuthService.signOut();
    }

    login(): void {
        this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    }

    refreshToken(): void {
        this.socialAuthService.refreshAuthToken(FacebookLoginProvider.PROVIDER_ID);
    }

    private getUser(): UserInfo {
		const value = localStorage.getItem("user");
        if (!value) {
            return null;
        }
        const user = new UserInfo(JSON.parse(value));
        if ((user.createdAt + 30 * 24 * 60 * 60 * 1000) < Date.now()) {
            return null;
        }
        return user;
	}

    private saveUser(user: UserInfo): void {
		localStorage.setItem("user", user ? JSON.stringify(user) : '');
	}

    private subscribeToAuthService(): void { 
        this.socialAuthService.authState.subscribe((user: SocialUser) => {
            var userInfo: UserInfo = null;
            if (user) {
                userInfo = new UserInfo();
                userInfo.name = `${user.firstName} ${user.lastName}`;
                userInfo.email = user.email;
                userInfo.authToken = user.authToken;
                userInfo.createdAt = Date.now();
            }
            this.set(userInfo);
        });
    }    
}
