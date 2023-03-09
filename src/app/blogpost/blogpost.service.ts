import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { Blogpost, BlogpostsFilter, SearchBlogpostResponse } from './model';

@Injectable({
	providedIn: 'root'
})
export class BlogpostService {
	private url = 'api/blogpost/';

	private blogposts$: Observable<SearchBlogpostResponse>;
	private searchBlogpostsChange$ = new Subject<BlogpostsFilter>();
	
	constructor(
		private httpClient: HttpClient
	) {

		this.searchBlogpostsChange$.subscribe(x => {
			console.log(`xxxxxxxxxxxxxxxxxxxx ${x}`);
		});

	}

	get(id: string): Observable<Blogpost> {
		return this.httpClient.get<Blogpost>(this.url + id);
	}

	upsert(blogpost: Blogpost): Observable<any> {
		return this.httpClient.put(this.url + blogpost.id, blogpost);
	}

	delete(blogpostId: number): Observable<any> {
		return this.httpClient.delete(this.url + blogpostId);
	}

	searchBlogposts(filter?: BlogpostsFilter): void {
		this.searchBlogpostsChange$.next(filter);
	}

	getBlogposts$(): Observable<SearchBlogpostResponse> {
		if (!this.blogposts$) {
			this.blogposts$ = this.searchBlogpostsChange$.pipe(
				switchMap(filter => this.searchBlogposts2(filter)),
				shareReplay(1)
			);
		}
		return this.blogposts$;
	}

	searchBlogposts2(filter?: BlogpostsFilter): Observable<SearchBlogpostResponse> {
		const params = this.getHttpParams(filter);
		return this.httpClient
			.get<SearchBlogpostResponse>(this.url, params)
			.pipe(map(x => new SearchBlogpostResponse(x)));
	}

	private getHttpParams(filter?: object): {} {
		let params = new HttpParams();
		if (filter) {
			Object.keys(filter)
				.filter(property => !property.startsWith('_'))
				.forEach(property => {
					const value = (<any>filter)[property];
					if (value !== null && value !== undefined) {
						params = params.append(property, `${value}`);
					}
				});
		}
		return { params };
	}
}
