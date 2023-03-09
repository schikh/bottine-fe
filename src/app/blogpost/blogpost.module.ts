import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UtilsModule } from '../utils/utils.module';
import { BlogpostEditComponent } from './edit/blogpost-edit.component';
import { SearchResultComponent } from './search/blogpost-search-result.component';
import { BlogpostSearchComponent } from './search/blogpost-search.component';
import { MainAreaComponent } from '../layout/main-area.component';
import { AuthorizationGuard } from '../account/authorization.gard';

const routes: Routes = [
	{
		path: 'blogpost',
		component: MainAreaComponent,
		children: [
			{
				path: 'search',
				component: BlogpostSearchComponent,
				//canActivate: [AuthorizationGuard]
			},
			{
				path: 'edit/:id',
				component: BlogpostEditComponent,
				//canActivate: [AuthorizationGuard]
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
		BlogpostSearchComponent,
		SearchResultComponent,
		BlogpostEditComponent
	],
	entryComponents: [
		BlogpostSearchComponent,
		BlogpostEditComponent
	],
	exports: [
		RouterModule,
		SearchResultComponent
	]
})
export class BlogpostModule {}
