import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginPageComponent } from './login.component';
import { Routes, RouterModule } from '@angular/router';
import { ChangePasswordComponent } from './change-password.component';

const routes: Routes = [
	{
		path: 'login',
		component: LoginPageComponent
	}
];

@NgModule({
  	imports: [
		CommonModule,
		FormsModule,
		NgbModule,
		RouterModule.forChild(routes)
	],
  	declarations: [
		LoginPageComponent,
		ChangePasswordComponent
	],
	exports: [
		LoginPageComponent,
		ChangePasswordComponent
	]
})
export class AccountModule { }
