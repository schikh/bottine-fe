import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { AccountModule } from './account/account.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import { SharedModule } from './shared/shared.module';
import { SpinnerModule } from './spinner/spinner.module';
import { TransactionModule } from './transaction/transaction.module';
import { GlobalErrorHandler } from './utils/global-error-handler';
import { NoCacheInterceptor } from './utils/no-cache-interceptor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'transactions/search'},
	{ path: '**', redirectTo: 'transaction/search' }
];

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		AccountModule,
		LayoutModule,
		TransactionModule,
		BrowserModule,
		NgbModule,
		HttpClientModule,
		SpinnerModule,
		SharedModule,
		BrowserAnimationsModule,
		ToastrModule.forRoot({ positionClass: 'toast-bottom-left' }),
		RouterModule.forRoot(routes, { useHash: true })
  ],
	providers: [
		{ provide: ErrorHandler, useClass: GlobalErrorHandler },
		{ provide: HTTP_INTERCEPTORS, useClass: NoCacheInterceptor, multi: true }
	],
  bootstrap: [AppComponent],
})
export class AppModule { }
