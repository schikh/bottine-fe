import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'xyz-confirmation-dialog',
	template: `
<div class="modal-header">
	<div class="header1 modal-title">{{ title }}</div>
	<button type="button" class="close" aria-label="Close" (click)="dismiss()">
		<span aria-hidden="true">&times;</span>
	</button>
</div>
<div class="modal-body">
	{{ message }}
</div>
<div class="modal-footer">
	<button type="button" class="btn btn-danger" *ngIf="btnOkText" (click)="accept()">
		{{ btnOkText }}
	</button>
	<button type="button" class="btn btn-primary" *ngIf="btnCancelText" (click)="decline()">
		{{ btnCancelText }}
	</button>
</div>
`
})
export class ConfirmationDialogComponent {

	@Input() title: string;
	@Input() message: string;
	@Input() btnOkText: string;
	@Input() btnCancelText: string;

	constructor(private activeModal: NgbActiveModal) {}

	public decline() {
		this.activeModal.close(false);
	}

	public accept() {
		this.activeModal.close(true);
	}

	public dismiss() {
		this.activeModal.dismiss();
	}
}
