import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';
import { AccountComponent } from './account/account.component';

const routes: Routes = [
    { path: 'account', component: AccountComponent }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        AccountComponent
    ],
    exports: [
        RouterModule
    ],
    entryComponents: [

    ]
})
export class SysManageModule { }
