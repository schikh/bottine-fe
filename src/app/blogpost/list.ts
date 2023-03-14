import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Blogpost, BlogpostsFilter } from './model';
import { AccountService } from 'src/app/account/account.service';

@Component({
	selector: 'xyz-search-result',
	template: `
<div class="row mb-2" *ngFor="let item of blogposts$ | async">
	<div class="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
		<div class="col p-4 d-flex flex-column position-static">
			<h3 class="mb-0">{{item.title}}</h3>
			<div class="mb-1 text-muted">Nov 12</div>
			<div class="card-text mb-auto" [innerHTML]="item.text"></div>
			<div >{{item.id }}</div>

			<a [routerLink]="['/blogpost', 'edit', item.id]">Edit</a>
			<button class="btn btn-link" [routerLink]="['/blogpost', 'edit', item.id]" style="width: 50px;">Edit</button>
		</div>
	</div>
</div>
`
})
export class SearchResultComponent implements OnInit {

	constructor(private router: Router, private accountService: AccountService) { }

	@Input()
	model: BlogpostsFilter;

	@Input()
	blogposts$: Observable<Blogpost[]>;

	htmlContent = '<h1>Hello Angular 14!</h1>';

	ngOnInit() {
	}

	// <!--  (click)="viewDetail(item.id, $event)"> -->
	// viewDetail(id: number, $event: any) {
	// 	$event.stopPropagation();
	// 	//this.router.navigateByUrl('/blogpost/' + id);
	// }
}
