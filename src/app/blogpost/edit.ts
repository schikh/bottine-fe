import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { DeviceService } from 'src/app/device/device.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { BlogpostService } from './service';
import { Blogpost } from './model';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
	template: `
<form #MyForm="ngForm">

<div class="container">

	<div class="d-flex align-items-center">
		<div class="flex-grow-1">
			<h1 class="my-3">Blog post</h1>
		</div>
		<div>
			<button class="btn btn-link" routerLink="/blogposts/search" style="width: 50px;">
			<i class="fas fa-arrow-alt-circle-up fa-2x"></i>
			</button>
		</div>
	</div>

	<div class="mb-3">
		<label for="title" class="form-label">Texte</label>
		<input type="text" class="form-control" [placeholder]="'Entrer le titre ici...'" 
			*ngIf="model"
			id="title" name="title"
			[(ngModel)]="model.title"
			required />
	</div>

	<div class="mb-3">
		<label for="text" class="form-label">Texte</label>
		<angular-editor [placeholder]="'Entrer le texte ici...'" 
			*ngIf="model" 
			[(ngModel)]="model.text" 
			id="text" name="text" 
			required>
		</angular-editor>
	</div>

	<app-upload-images [blogpostId]="id"></app-upload-images>

	<div class="modal-footer">
		<button type="button" class="btn btn-danger" [routerLink]="['/blogpost', 'read', model.id]">Visualiser</button>		
		<button type="button" class="btn btn-primary" [disabled]="!model || !dirty || !MyForm.valid" (click)="apply()">Sauver</button>
		<button type="button" class="btn btn-danger" routerLink="/blogpost/search">Fermer</button>		
	</div>
</div>

</form>
	`,
	styles: [`
		.form-control.ng-touched.ng-invalid{
			border-color: red;
		}
	`],
})
export class BlogpostEditComponent implements OnInit {

	constructor(
		private blogpostService: BlogpostService,
		private dialogService: DialogService,
		private activatedRoute: ActivatedRoute
	) { }

	private modelCopy: Blogpost;
	model: Blogpost;
	id: string;

	ngOnInit() {
		this.parseRouteParameters();
		this.get();
	}

	private parseRouteParameters() {
		this.id = this.activatedRoute.snapshot.paramMap.get('id');
	}

	private get() {
		if (this.id) {
            this.blogpostService
                .get(this.id) 
                .subscribe((b: Blogpost) => {
                    this.modelCopy = b.clone();			  
                    this.model = b;
                });
		} else {
            const blogpost = new Blogpost();
			blogpost.id = (new Date()).toISOString().replace(/[^0-9]/g, '');
            this.modelCopy = blogpost.clone();			  
            this.model = blogpost;
		}
	}

	apply(): void {
		const model = this.model.clone();
		this.blogpostService.upsert(model).subscribe(
			() => {
				this.dialogService.success('Blog sauvegardé');
				this.model = model;
			},
			(error: any) => {
				error = error.error || error;
				const message = error.ExceptionMessage || error.message || error.Message;
				this.dialogService.error(message, 'Erreur technique');
			}
		);
	}

	deleteBlogpost(node: Blogpost, $event: any): void {
		$event.stopPropagation();
		this.dialogService.confirm('Information', 'Suprimer le blog ?')
			.then(result => result && this.delete(node));
	}


	private delete(node: Blogpost): void {
		this.blogpostService.delete(node.id)
			.subscribe(
				(_ : any) => {
					this.dialogService.success('Blog suprimée');
				}
			);
	}	

	get dirty(): boolean {
		const m: any = this.model;
		const c: any = this.modelCopy;
		return Object.keys(this.model).some(p => m[p] !== c[p]);
	}

	config: AngularEditorConfig = {
		editable: true,
		spellcheck: true,
		height: '15rem',
		minHeight: '5rem',
		placeholder: 'Enter text here...',
		translate: 'no',
		defaultParagraphSeparator: 'p',
		defaultFontName: 'Arial',
		toolbarHiddenButtons: [
		  ['bold']
		  ],
		customClasses: [
		  {
			name: "quote",
			class: "quote",
		  },
		  {
			name: 'redText',
			class: 'redText'
		  },
		  {
			name: "titleText",
			class: "titleText",
			tag: "h1",
		  },
		]
	  };
}
