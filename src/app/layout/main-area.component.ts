import { Component } from '@angular/core';

@Component({
	selector: 'xyz-order',
	template: `
<div class="main-area-container">
	<div class="main-area">
		<div class="container-fluid">
			<router-outlet></router-outlet>
		</div>
	</div>
</div>
	`
})
export class MainAreaComponent {
}
