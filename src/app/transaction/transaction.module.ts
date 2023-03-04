import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UtilsModule } from '../utils/utils.module';
import { TransactionEditComponent } from './edit/transaction-edit.component';
import { TransactionHierarchyComponent } from './hierarchy/transaction-hierarchy.component';
import { SearchPanelComponent } from './search/transaction-search-panel.component';
import { SearchResultComponent } from './search/transaction-search-result.component';
import { TransactionSearchComponent } from './search/transaction-search.component';
import { MainAreaComponent } from '../layout/main-area.component';
import { AuthorizationGuard } from '../account/authorization.gard';

const routes: Routes = [
	{
		path: 'transaction',
		component: MainAreaComponent,
		children: [
			{
				path: 'search',
				component: TransactionSearchComponent,
				canActivate: [AuthorizationGuard]
			},
			{
				path: 'hierarchy/:id',
				component: TransactionHierarchyComponent,
				canActivate: [AuthorizationGuard]
			}
		]
	}
];

@NgModule({
  	imports: [
		CommonModule,
		FormsModule,
		NgbModule,
		UtilsModule,
		RouterModule,
		RouterModule.forChild(routes)
	],
  	declarations: [
		TransactionSearchComponent,
		SearchPanelComponent,
		SearchResultComponent,
		TransactionHierarchyComponent,
		TransactionEditComponent
	],
	entryComponents: [
		TransactionSearchComponent,
		TransactionEditComponent
	],
	exports: [
		RouterModule,
		SearchPanelComponent,
		SearchResultComponent
	]
})
export class TransactionModule {}
