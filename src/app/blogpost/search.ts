import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, startWith, switchMap, shareReplay, tap } from 'rxjs/operators';
import { Blogpost, BlogpostsFilter } from './model';
import { BlogpostService } from './service';
import { DialogService } from 'src/app/shared/dialog.service';
import { LocalStorageService } from 'src/app/shared/local-storage.service';
import { ComponentBase } from '../ComponentBase';
import { AuthService } from '../auth/auth.service';

@Component({
	template: `

<!-- <div class="container-fluid py-3">
  <div class="row my-3">
    <div class="col">
      <label for="exampleFormControlInput1" class="form-label">Email address</label>
      <input type="email" class="form-control form-control-sm" id="exampleFormControlInput1" placeholder="name@example.com">
    </div>
  </div>
  <div class="row my-3">
    <div class="col">
      <label for="exampleFormControlTextarea1" class="form-label">Example textarea</label>
      <textarea class="form-control form-control-sm" id="exampleFormControlTextarea1" rows="3"></textarea>
    </div>
  </div>
  <div class="row my-3">
    <div class="col">
      <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault">
        <label class="form-check-label" for="flexSwitchCheckDefault">Default switch checkbox input</label>
      </div>
    </div>
  </div>
  <div class="row my-3">
    <div class="col">
      <button class="btn btn-sm btn-outline-primary" >Launch demo modal</button>
    </div>
  </div>
</div> -->



	<!-- <div class="p-2 debug">Flex item</div> -->
	<!-- <form class="d-flex" style="display: none;">
		<div class="p-2 text-nowrap">Filtrer le résultat:</div>
		<input class="form-control me-1" type="search" [(ngModel)]="filter" name="search" (keyup)="onFilterChange($event.code)"/>
		<button class="btn btn-primary" (click)="clearFilter()" xxxstyle="width: 40px;">
			<i class="fa-solid fa-magnifying-glass"></i>
			<i class="bi bi-search"></i>
		</button>
	</form> -->

<div class="container">

    <div class="d-flex align-items-end">
        <h1 class="mt-4">Evénements</h1>
        <div class="ms-auto" *ngIf="isLogged">
            <button class="btn btn-danger" routerLink="/blogpost/edit">Ajouter un événement</button>		
        </div>
    </div>

    <div class="search-result-table-area">
        <xyz-search-result [model]="model" [blogposts$]="blogposts$">
        </xyz-search-result>
    </div>
    <div class="my-3">
        <button type="button" class="btn btn-outline-primary" style="width: 160px"
            (click)="previousPage()" [disabled]="!model.previousPageAvailable">
            <i class="fas fa-caret-left fa-lg mr-1"></i>
            Page précédente
        </button>
        <button type="button" class="btn btn-outline-primary" style="width: 160px"
            (click)="nextPage()" [disabled]="!model.nextPageAvailable">
            Page suivante
            <i class="fas fa-caret-right fa-lg ml-1"></i>
        </button>
    </div>
</div>
`
})
export class BlogpostSearchComponent extends ComponentBase implements OnInit {

	constructor(
		private blogpostService: BlogpostService,
        accountService: AuthService
	) {
        super(accountService);
	}

	blogposts$: Observable<Blogpost[]>;
	model: BlogpostsFilter;
	filter: string;

	ngOnInit(): void {
		this.restoreFilter();
		const list$ = this.blogpostService.getBlogposts$();

		list$.subscribe(	
			(x: any) => { 
				return  this.calculatePagingInfo(x.totalRecords); 
			}
		);

		this.blogposts$ = list$.pipe(
		    map(x => x.blogposts),
			shareReplay(1)
		);

		this.blogpostService.searchBlogposts(new BlogpostsFilter({}));
	}

	onExecuteSearch(): void {
		this.model.page = 1;
		this.executeSearch();
	}

	onClearSearch(): void {
		this.model.clear();
	}

	private calculatePagingInfo(totalRecords: number): void {
		const totalPages = Math.max(1, Math.ceil(totalRecords / this.model.pageSize));
		const previousPageAvailable = this.model.page > 1;
		const nextPageAvailable = this.model.page < totalPages;
		this.model.totalPages = totalPages;
		this.model.previousPageAvailable = previousPageAvailable;
		this.model.nextPageAvailable = nextPageAvailable;
	}

	private restoreFilter(): void {
		this.model = <BlogpostsFilter> {};
		//this.model = this.localStorageService.getBlogpostsFilter();
	}

	private saveFilter(): void {
		//this.localStorageService.saveBlogpostsFilter();
	}

	previousPage(): void {
		this.model.previousPage();
		this.executeSearch();
	}

	nextPage(): void {
		this.model.nextPage();
		this.executeSearch();
	}

	private executeSearch(): void {
		this.saveFilter();
		this.blogpostService.searchBlogposts(this.model.clone());
	}

	onFilterChange(value: string): void {
	}

	clearFilter(): void {
		this.filter = '';
		this.onFilterChange('');
	}
}
