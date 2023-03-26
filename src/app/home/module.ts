import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MainAreaComponent } from '../layout/main-area.component';
import { UtilsModule } from '../utils/utils.module';
import { PageComponent } from './page';
import { BlogpostModule } from "../blogpost/module";

const routes: Routes = [
	{
		path: 'main',
		component: MainAreaComponent,
		children: [
			{
				path: 'home',
				component: PageComponent,
				//canActivate: [AuthorizationGuard]
			}
		]		
	}
];

@NgModule({
    declarations: [
        PageComponent
    ],
    entryComponents: [
        PageComponent
    ],
    exports: [
        RouterModule
    ],
    imports: [
        // CommonModule,
        // FormsModule,
        NgbModule,
        // UtilsModule,
        RouterModule,
        RouterModule.forChild(routes),
        BlogpostModule
    ]
})
export class HomeModule {}
