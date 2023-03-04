import { Directive, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

export type SortDirection = 'asc' | 'desc' | '';

export interface SortEvent {
  column: string;
  direction: SortDirection;
}

@Directive({
	selector: 'th[sortable]'
})
export class SortableTableHeaderDirective {

	@Input() sortable: string;

	@HostBinding('class')
	@Input() direction: SortDirection = '';

	@Output() sort = new EventEmitter<SortEvent>();

	@HostListener('click')
	rotate() {
		const rotate: {[key: string]: SortDirection} = { asc: 'desc', desc: '', '': 'asc' };
		this.direction = rotate[this.direction];
		this.sort.emit({column: this.sortable, direction: this.direction});
	}
}
