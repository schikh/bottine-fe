import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { ProfileComponent } from './profile.component';
import { AfterLoginService } from './after-login.service';
import { BeforeLoginService } from './before-login.service';
import { SocialLoginModule } from '@abacritt/angularx-social-login';

const routes: Routes = [
  { path:'login', component:LoginComponent },
  { path:'profile', component:ProfileComponent }
  // { path:'login', component:LoginComponent, canActivate:[BeforeLoginService] },
  // { path:'profile', component:ProfileComponent, canActivate:[AfterLoginService] }
];

@NgModule({
  imports: [
    SocialLoginModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AuthModule { }
