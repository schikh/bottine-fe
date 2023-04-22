import { FilterBase } from "../shared/Filter-base";

export class SearchBlogpostResponse {

	public constructor(init?: Partial<SearchBlogpostResponse>) {
		this.blogposts = init.blogposts ? init.blogposts.map(t => new Blogpost(t)) : [];
		this.totalRecords = init.totalRecords;
	}

	blogposts: Blogpost[];
	totalRecords: number;
}

export class Blogpost {

    public constructor(init?: Partial<Blogpost>) {
		Object.assign(this, init);
	}

	get id(): string {
		return (<any>this)['_id'];
	}
	
	set id(value: string) {
		(<any>this)['_id'] = value;
	}

	title: string;
	text: string;
	paths: string[];
	createdAt: string;
	createdBy: string;
	updatedAt: string;
	updatedBy: string;

	get createdAtDate(): string {
		return new Date(Date.parse(this.createdAt)).toLocaleDateString('fr-FR', 
        {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour12: false,
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit'
          }
          );
	}

	clone(): Blogpost {
		return new Blogpost(this);
	}
}

export class BlogpostsFilter extends FilterBase {
	public constructor(init: Partial<BlogpostsFilter>) {
		super();
		Object.assign(this, init);
	}

	clone(): BlogpostsFilter {
		const c = new BlogpostsFilter(this);
		return c;
	}
}

export class BlogpostHierarchyFilter {
	ID: number;
}
