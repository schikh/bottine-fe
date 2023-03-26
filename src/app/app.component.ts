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
	<footer class="text-center text-uppercase py-5">
        <div class="copyright pt-4 text-muted text-center">
          <p>&copy; 2022 YOUR-DOMAIN | Created by <a href="https://firmbee.com/solutions/free-invoicing-app-billing-software/" title="Firmbee - Free Invoicing App" target="_blank">Firmbee.com</a> </p>
      </div>
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
