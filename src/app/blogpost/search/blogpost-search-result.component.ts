import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SortableTableHeaderDirective, SortEvent } from 'src/app/utils/sortable-table-header.directive';
import { Blogpost, BlogpostsFilter } from '../model';
import { AccountService } from 'src/app/account/account.service';

@Component({
	selector: 'xyz-search-result',
	template: `
<div class="row mb-2" *ngFor="let item of blogposts$ | async" (click)="viewDetail(item.id, $event)">
	<div class="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
	<div class="col p-4 d-flex flex-column position-static">
		<h3 class="mb-0">{{item.title}}</h3>
		<div class="mb-1 text-muted">Nov 12</div>
		<p class="card-text mb-auto">{{item.text}}</p>
		<a href="#" class="stretched-link">Continue reading</a>
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

	ngOnInit() {
	}

	viewDetail(id: number, $event: any) {
		$event.stopPropagation();
		this.router.navigateByUrl('/blogpost/' + id);
	}
}
