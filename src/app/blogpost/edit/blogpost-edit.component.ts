import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { DeviceService } from 'src/app/device/device.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { BlogpostService } from '../blogpost.service';
import { Blogpost } from '../model';

@Component({
	template: `
<form #MyForm="ngForm">

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

	<div class="">
		<div class="form-group row">
			<label class="col-3 col-form-label alignright">Titre</label>
			<div class="col-7">
				<input type="text" class="form-control"
				name="titleInput"
				[(ngModel)]="model.title"
				required />
			</div>
		</div>

		<div class="form-group row">
			<label class="col-3 col-form-label alignright">Texte</label>
			<div class="col-7">
				<input type="text" class="form-control"
					name="textInput"
					[(ngModel)]="model.text"
					required />
			</div>
		</div>
	</div>

	<div class="modal-footer">
		<button type="button" class="btn btn-primary" [disabled]="!dirty || !MyForm.valid" (click)="apply()">Appliquer</button>
		<button type="button" class="btn btn-danger" routerLink="/blogposts/search">Annuler</button>		
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
		this.getBlogpost();
		this.modelCopy = this.model.clone();
	}

	private parseRouteParameters() {
		this.id = this.activatedRoute.snapshot.paramMap.get('id');
	}

	private getBlogpost() {
		this.blogpostService
		.get(this.id)
		.subscribe((b: Blogpost) => this.model = b);
	}

	apply(): void {
		const model = this.model.clone();

		this.blogpostService.upsert(model).subscribe(
			() => {
				this.dialogService.success('Blog ajouté');
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
}
