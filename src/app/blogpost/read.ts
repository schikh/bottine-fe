import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'src/app/shared/dialog.service';
import { BlogpostService } from './service';
import { Blogpost } from './model';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { map } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
    template: `
<form #MyForm="ngForm" *ngIf="model">

<div class="container">
	<div class="col d-grid gap-3 my-3" *ngIf="model.id">
		<h2 class=" my-3">{{model.title}}</h2>
		<div class="card-text" [innerHTML]="model.text"></div>

        <div class="w-auto" style="min-height: 0px;background-color: #eee;">
            <img *ngFor="let path of paths" [src]="path" class="preview" style="width: 200px; height: 200px; object-fit: cover;" />
        </div>        

        <div class="d-flex align-items-end">
            <div class="text-muted">{{model.createdBy}} - {{model.createdAtDate}}</div>
            <div class="ms-auto">
            <button class="btn btn-outline-primary" [routerLink]="['/blogpost', 'edit', model.id]" *ngIf="canEdit(model)">Modifier</button>
            </div>
        </div>        
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
        private activatedRoute: ActivatedRoute,
        private accountService: AuthService
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
            this.modelCopy = blogpost.clone();
            this.model = blogpost;
        }
    }

    apply(): void {
        const model = this.model.clone();
        this.blogpostService.upsert(model).subscribe(
            () => {
                this.dialogService.success('Evénement sauvegardé');
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
        this.dialogService.confirm('Information', "Suprimer l'événement ?")
            .then(result => result && this.delete(node));
    }

    canEdit(blogpost: Blogpost) {
        return blogpost.id && this.accountService.isLogged;
    }

    private delete(node: Blogpost): void {
        this.blogpostService.delete(node.id)
            .subscribe(
                () => {
                    this.dialogService.success('Evénement suprimée');
                }
            );
    }

    get dirty(): boolean {
        const m: any = this.model;
        const c: any = this.modelCopy;
        return Object.keys(this.model).some(p => m[p] !== c[p]);
    }

    get paths(): string[] {
        return this.model.paths && []
    }

    config: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        // height: '15rem',
        // minHeight: '5rem',
//      placeholder: 'Enter text here...',
        translate: 'no',
        defaultParagraphSeparator: 'p',
//        defaultFontName: 'Arial',
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
