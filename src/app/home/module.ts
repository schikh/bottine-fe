import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageComponent } from './page';
import { BlogpostModule } from "../blogpost/module";

const routes: Routes = [
    {
        path: 'home',
        component: PageComponent,
        //canActivate: [AuthorizationGuard]
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
        NgbModule,
        RouterModule,
        RouterModule.forChild(routes),
        BlogpostModule
    ]
})
export class HomeModule {}
