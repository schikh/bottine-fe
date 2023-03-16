import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UtilsModule } from '../utils/utils.module';
import { BlogpostEditComponent } from './edit';
import { SearchResultComponent } from './list';
import { BlogpostSearchComponent } from './search';
import { MainAreaComponent } from '../layout/main-area.component';
import { AuthorizationGuard } from '../account/authorization.gard';
import { AngularEditorModule } from '@kolkov/angular-editor';

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
				path: 'edit',
				component: BlogpostEditComponent,
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
		AngularEditorModule,
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
		AngularEditorModule,
		SearchResultComponent
	]
})
export class BlogpostModule {}
