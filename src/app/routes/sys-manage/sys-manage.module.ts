import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';
import { AccountComponent } from './account/account.component';
import { EmployeeStatusPipe } from './account/employee-status.pipe';
import { AccountStatusPipe } from './account/account-status.pipe';

const routes: Routes = [
    { path: 'account', component: AccountComponent }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        AccountComponent,
        EmployeeStatusPipe,
        AccountStatusPipe
    ],
    exports: [
        RouterModule
    ],
    entryComponents: [

    ]
})
export class SysManageModule { }
