import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';

@Component({
	selector: 'xyz-root',
	template: `
<div class="wrapper">
	<header>
	    <xyz-header></xyz-header>
	</header>
    <div class="main-area-container">
        <div class="main-area">
            <router-outlet></router-outlet>
        </div>
    </div>
	<footer class="footer d-flex align-items-center justify-content-center">
        <span>
            &copy; 2023 Les z’amis d’el bottine qui bique !
        </span>
    </footer>
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
