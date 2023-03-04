import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';

@NgModule({
	declarations: [
		ConfirmationDialogComponent
	],
	entryComponents: [
		ConfirmationDialogComponent
	],
	imports: [CommonModule]
})
export class SharedModule {}
