import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Blogpost, BlogpostsFilter } from './model';
import { AuthService } from '../auth/auth.service';

@Component({
	selector: 'xyz-search-result',
	template: `
<div class="d-grid gap-3">
    <div class="rounded shadow-sm" *ngFor="let model of blogposts$ | async">
        <div class="d-grid gap-3 p-3">
            <h3>{{model.title}}</h3>
            <div [innerHTML]="model.text.substr(0, 500)"></div>
            <div class="d-flex align-items-end">
                <div class="text-muted">{{model.createdBy}} - {{model.createdAtDate}}</div>
                <div class="ms-auto">
                <button class="btn btn-outline-primary" [routerLink]="['/blogpost', 'read', model.id]">La suite...</button>
                <button class="btn btn-outline-primary" [routerLink]="['/blogpost', 'edit', model.id]" *ngIf="canEdit(model)">Modifier</button>
                </div>
            </div>
        </div>        
    </div>
</div>

`
})
export class SearchResultComponent {

	constructor(private router: Router, private accountService: AuthService) { }

	@Input()
	model: BlogpostsFilter;

	@Input()
	blogposts$: Observable<Blogpost[]>;

	htmlContent = '<h1>Hello Angular 14!</h1>';

    canEdit(blogpost: Blogpost) {
        return blogpost.id && this.accountService.isLogged;
    }

    get isLogged() {
        return this.accountService.isLogged;
    }

	// <!--  (click)="viewDetail(item.id, $event)"> -->
	// viewDetail(id: number, $event: any) {
	// 	$event.stopPropagation();
	// 	//this.router.navigateByUrl('/blogpost/' + id);
	// }
}
