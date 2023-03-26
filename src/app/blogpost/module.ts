import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UtilsModule } from '../utils/utils.module';
import { BlogpostEditComponent } from './edit';
import { SearchResultComponent } from './result';
import { BlogpostSearchComponent } from './search';
import { MainAreaComponent } from '../layout/main-area.component';
import { AuthorizationGuard } from '../account/authorization.gard';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { BlogpostReadComponent } from './read';
import { BlogpostsSummaryComponent } from './latest';
import { UploadImagesModule } from '../files-upload/module';

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
				path: 'read/:id',
				component: BlogpostReadComponent,
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
        UploadImagesModule,
		AngularEditorModule,
		RouterModule,
		RouterModule.forChild(routes)
	],
  	declarations: [
		BlogpostSearchComponent,
		SearchResultComponent,
		BlogpostEditComponent,
		BlogpostReadComponent,
		BlogpostsSummaryComponent
	],
	entryComponents: [
		BlogpostSearchComponent,
		BlogpostEditComponent,
		BlogpostReadComponent,
		BlogpostsSummaryComponent
	],
	exports: [
		RouterModule,
		AngularEditorModule,
		SearchResultComponent,
		BlogpostsSummaryComponent
	]
})
export class BlogpostModule {}
