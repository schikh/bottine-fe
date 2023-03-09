import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';

@Component({
	selector: 'xyz-root',
	template: `
<div class="wrapper">
	<header>
	  <xyz-header></xyz-header>
	</header>
	<div class="main-content">
	  <router-outlet></router-outlet>
	</div>
</div>
<xyz-spinner-component></xyz-spinner-component>
`
})
export class AppComponent {
	constructor(@Inject(DOCUMENT) private document: Document) {
		const host = window.location.host.toLowerCase();
		// if (host !== 'apps.ores.net') {
		// 	const head = this.document.getElementsByTagName('head')[0];
		// 	const style = this.document.createElement('link');
		// 	style.rel = 'stylesheet';
		// 	style.href = 'acceptance-styles.css';
		// 	head.appendChild(style);
		// }
	}
}
