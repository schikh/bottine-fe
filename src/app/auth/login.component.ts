import { Component, OnInit } from '@angular/core';
import { AuthService, UserInfo } from './auth.service';

@Component({
    selector: 'app-login',
    template: `
  <div class="col-8">
  <div class="card">
      <div class="card-header">
          Login Here
      </div>

      <div *ngIf="isLoggedin !== true">
        <div class="card-body">
            <button type="button" (click)="login()" class="btn btn-primary btn-block">Signin with Facebook</button>
        </div>
      </div>

      <div *ngIf="isLoggedin === true">
        <div>
          <h4>{{ user }}</h4>
        </div>
        <button type="button" (click)="logout()" class="btn btn-primary">Sign Out</button>
      </div>
  </div>
</div>
`
})
export class LoginComponent implements OnInit {

    constructor(private authService: AuthService) {}

    ngOnInit(): void {}

    get user(): UserInfo {
        return this.authService.user;
    }

    get isLogged(): boolean {
        return this.authService.isLogged;
    }

    login(): void {
        this.authService.login();
    }

    logout(): any {
        this.authService.logout();
    }
}
