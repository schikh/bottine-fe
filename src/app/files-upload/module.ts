import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UploadImagesComponent } from './upload-images.component';

@NgModule({
  	imports: [
		CommonModule,
		NgbModule,
	],
  	declarations: [
		UploadImagesComponent
	],
	entryComponents: [
	],
	exports: [
		UploadImagesComponent
	]
})
export class UploadImagesModule {}
