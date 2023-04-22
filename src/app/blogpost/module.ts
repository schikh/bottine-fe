import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UtilsModule } from '../utils/utils.module';
import { BlogpostEditComponent } from './edit';
import { SearchResultComponent } from './result';
import { BlogpostSearchComponent } from './search';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { BlogpostReadComponent } from './read';
import { BlogpostsSummaryComponent } from './latest';
import { UploadImagesModule } from '../files-upload/module';

const routes: Routes = [
    {
        path: 'blogpost/search',
        component: BlogpostSearchComponent,
        //canActivate: [AuthorizationGuard]
    },
    {
        path: 'blogpost/read/:id',
        component: BlogpostReadComponent,
    },
    {
        path: 'blogpost/edit',
        component: BlogpostEditComponent,
    },
    {
        path: 'blogpost/edit/:id',
        component: BlogpostEditComponent,
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
