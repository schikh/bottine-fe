export class FilterBase {
	page = 1;
	pageSize = 100;

	totalPages = 0;
	previousPageAvailable = false;
	nextPageAvailable = false;

	previousPage() {
		this.page = this.page <= 1 ? 1 : this.page - 1;
	}

	nextPage() {
		this.page = this.page + 1;
	}

	clear(): void {
		Object.keys(this).forEach(property => {
			(this as any)[property] = undefined;
		});
		this.page = 1;
		this.pageSize = 100;
		this.totalPages = 0;
		this.previousPageAvailable = false;
		this.nextPageAvailable = false;		
	}
}
