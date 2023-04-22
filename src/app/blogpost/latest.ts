import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, startWith, switchMap, shareReplay, tap } from 'rxjs/operators';
import { Blogpost, BlogpostsFilter } from './model';
import { BlogpostService } from './service';
import { DialogService } from 'src/app/shared/dialog.service';
import { LocalStorageService } from 'src/app/shared/local-storage.service';
import { Router } from '@angular/router';

@Component({
	selector: 'xyz-blogpost-summary',	
	template: `
<div class="blogpostsSummaryContainer">
<div class="row mb-1" *ngFor="let item of blogposts$ | async">
	<div class="row border overflow-hidden mb-1 shadow-sm">
		<div class="col p-2 d-flex flex-column position-static">
			<h6>{{item.title}}</h6>
			<div class="my-2 text-truncate" [innerHTML]="item.text.substr(0, 200)" style="font-size: 0.8em;"></div>
			<a [routerLink]="['/blogpost', 'read', item.id]">La suite...</a>
		</div>
	</div>
</div>
<a class="" [routerLink]="['/blogpost', 'search']">Tout les événements...</a>
</div>
`
})
export class BlogpostsSummaryComponent implements OnInit {

	constructor(
		private blogpostService: BlogpostService,
		private dialogService: DialogService,
		private localStorageService: LocalStorageService,
		private router: Router
	) {	}

	blogposts$: Observable<Blogpost[]>;
	model: BlogpostsFilter;
	filter: string;

	ngOnInit(): void {
		this.blogposts$ = this.blogpostService.searchBlogposts2(new BlogpostsFilter({}))
		.pipe(
		    map(x => x.blogposts.slice(0, 3)),
			shareReplay(1)
		);
	}
}
