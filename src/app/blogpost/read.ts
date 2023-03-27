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

	<!-- <div class="d-flex align-items-center">
		<div class="flex-grow-1">
			<h1 class="my-3">Blog post</h1>
		</div>
		<div>
			<button class="btn btn-link" routerLink="/blogposts/search" style="width: 50px;">
			<i class="fas fa-arrow-alt-circle-up fa-2x"></i>
			</button>
		</div>
	</div> -->

	<div class="col d-grid gap-3 m-3" *ngIf="model?.id">
		<h2 class="">{{model.title}}</h2>
		<div class="card-text" [innerHTML]="model.text"></div>
		<div class="text-muted">Nov 12</div>
        <ul class="list-group list-group-flush" *ngFor="let path of model?.paths">
            <li class="list-group-item">
                <img src="{{ path }}" height="80px" />
            </li>
        </ul>
    </div>

	<div class="modal-footer" *ngIf="model?.id">
		<button type="button" class="btn btn-primary" [routerLink]="['/blogpost', 'edit', model?.id]">Editer</button>
		<button type="button" class="btn btn-primary" routerLink="/blogpost/search">Fermer</button>		
	</div>

</div>

</form>
`,
    styles: [`.form-control.ng-touched.ng-invalid{border-color: red;}`],
})
export class BlogpostReadComponent implements OnInit {

    constructor(
        private blogpostService: BlogpostService,
        private dialogService: DialogService,
        private activatedRoute: ActivatedRoute
    ) { }

    private modelCopy: Blogpost;
    model?: Blogpost;
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
                (_: any) => {
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
