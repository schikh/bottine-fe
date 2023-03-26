import { Component, Input, OnInit } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileUploadService } from './file-upload.service';

@Component({
    selector: 'app-upload-images',
    template: `
<div *ngFor="let progressInfo of progressInfos" class="mb-2">
  <span>{{ progressInfo.fileName }}</span>
  <div class="progress">
    <div class="progress-bar progress-bar-info"
      role="progressbar"
      [ngStyle]="{ width: progressInfo.value + '%' }">
      {{ progressInfo.value }}%
    </div>
  </div>
</div>

<div class="row">
  <div class="col-8">
    <label class="btn btn-default p-0">
      <input type="file" accept="image/*" multiple (change)="selectFiles($event)" />
    </label>
  </div>

  <div class="col-4">
    <button class="btn btn-success btn-sm" [disabled]="!selectedFiles" (click)="uploadFiles()">
      Upload
    </button>
  </div>
</div>

<div>
  <img *ngFor='let preview of previews' [src]="preview" class="preview">
</div>

<div *ngIf="message.length" class="alert alert-secondary my-3" role="alert">
  <ul *ngFor="let msg of message; let i = index">
    <li>{{ msg }}</li>
  </ul>
</div>

<div class="card mt-3">
  <div class="card-header">List of Images</div>
  <ul class="list-group list-group-flush" *ngFor="let image of imageInfos | async">
    <li class="list-group-item">
      <p><a href="{{ image.url }}">{{ image.name }}</a></p>
      <img src="{{ image.url }}" alt="{{ image.name }}" height="80px" />
    </li>
  </ul>
</div>
`,
    styles: ['.preview { max-width: 200px; }']
})
export class UploadImagesComponent implements OnInit {

    selectedFiles?: FileList;
    progressInfos: any[] = [];
    message: string[] = [];

    previews: string[] = [];
    imageInfos?: Observable<any>;

    @Input()
    blogpostId: string;

    constructor(private uploadService: FileUploadService) { }

    ngOnInit(): void {
        //this.imageInfos = this.uploadService.getFiles();
    }

    selectFiles(event: any): void {
        this.message = [];
        this.progressInfos = [];
        this.selectedFiles = event.target.files;
        this.previews = [];

        if (this.selectedFiles && this.selectedFiles[0]) {
            const numberOfFiles = this.selectedFiles.length;
            for (let i = 0; i < numberOfFiles; i++) {
                const reader = new FileReader();

                reader.onload = (e: any) => {
                    console.log(e.target.result);
                    this.previews.push(e.target.result);
                };

                reader.readAsDataURL(this.selectedFiles[i]);
            }
        }
    }

    upload(idx: number, file: File): void {
        this.progressInfos[idx] = { value: 0, fileName: file.name };

        if (file) {
            this.uploadService.upload(this.blogpostId, file).subscribe({
                next: (event: any) => {
                    if (event.type === HttpEventType.UploadProgress) {
                        this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
                    } else if (event instanceof HttpResponse) {
                        const msg = 'Uploaded the file successfully: ' + file.name;
                        this.message.push(msg);
                        //this.imageInfos = this.uploadService.getFiles();
                    }
                },
                error: (err: any) => {
                    this.progressInfos[idx].value = 0;
                    const msg = 'Could not upload the file: ' + file.name;
                    this.message.push(msg);
                }
            });
        }
    }

    uploadFiles(): void {
        this.message = [];

        if (this.selectedFiles) {
            for (let i = 0; i < this.selectedFiles.length; i++) {
                this.upload(i, this.selectedFiles[i]);
            }
        }
    }
}
