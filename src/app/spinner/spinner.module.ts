import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { SpinnerInterceptor } from './spinner-interceptor.service';
import { SpinnerComponent } from './spinner.component';
import { SpinnerService } from './spinner.service';

@NgModule({
	declarations: [
		SpinnerComponent
	],
	exports: [
		SpinnerComponent
	],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true },
		SpinnerService
	],
	imports: [CommonModule]
})
export class SpinnerModule {}
