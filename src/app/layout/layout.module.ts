import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header.component';
import { MainAreaComponent } from './main-area.component';
import { AccountModule } from '../account/account.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
	imports: [CommonModule, RouterModule, AccountModule, NgbModule],
	declarations: [MainAreaComponent, HeaderComponent],
	exports: [MainAreaComponent, HeaderComponent]
})
export class LayoutModule {}
