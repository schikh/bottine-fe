import { Component, Input, Output, ViewChild, EventEmitter, ElementRef, OnInit } from '@angular/core';

@Component({
	selector: 'xyz-upload-file',
	template: `
<button type="button" class="btn btn-warning ml-5" style="width: 160px"
	(click)="onClick()">
	<i class="fas fa-upload fa-lg mr-2"></i>
	{{label}}
</button>
<input #fileInput type="file"
	(change)="inputFileSelected($event)"
	[accept]="fileTypeFilter"
	style="display: none;">
	`
})
export class UploadFileComponent implements OnInit {
	@Input() label: string;
	@Input() extensions: string;
	@Input() fileType: string;
	@Output() fileSelected = new EventEmitter<FileList>();
	@ViewChild('fileInput', { static: true })
	fileInput: ElementRef;
	fileTypeFilter: string;

	ngOnInit(): void {
		// Extensions and fileType are exclusive - choose one not both
		if (!this.extensions) {
			this.fileTypeFilter = this.getFileTypeFilter(this.fileType);
		} else {
			this.fileTypeFilter = this.extensions;
		}
	}

	onClick(): void {
		const input = this.fileInput.nativeElement;
		input.value = null;
		input.click();
	}

	inputFileSelected(event: any) {
		this.fileSelected.emit(event.target.files);
	}

	private getFileTypeFilter(fileType: string): string {
		switch (fileType) {
			case 'excel':
				return 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
			default:
				return undefined;
		}
	}
}
