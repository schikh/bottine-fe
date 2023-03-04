import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

	constructor(private modalService: NgbModal, private toastr: ToastrService) {}

	confirm(
		title: string,
		message: string,
		btnOkText: string = 'Oui',
		btnCancelText: string = 'Non',
		dialogSize: 'sm' | 'lg' = 'sm'
	): Promise<any> {
		const modalRef = this.modalService.open(ConfirmationDialogComponent, {
			size: dialogSize,
			backdrop: 'static'
		});
		modalRef.componentInstance.title = title;
		modalRef.componentInstance.message = message;
		modalRef.componentInstance.btnOkText = btnOkText;
		modalRef.componentInstance.btnCancelText = btnCancelText;
		return modalRef.result.catch((error) => {
			if (error) {
				console.error(error);
			}
			return false;
		});
	}

	success(content: string, title: string = 'Info') {
		this.toastr.success(content, title);
	}

	error(content: string, title: string = 'Erreur') {
		this.toastr.error(content, title, { onActivateTick: true, enableHtml: true });
	}

	warning(content: string, title: string = 'Info') {
		this.toastr.warning(content, title);
	}

	info(content: string, title: string = 'Info') {
		this.toastr.info(content, title);
	}
}
