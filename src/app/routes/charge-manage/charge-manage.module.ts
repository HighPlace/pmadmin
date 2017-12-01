import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';
import { SubjectComponent } from './subject/subject.component';
import { ChargeComponent } from './charge/charge.component';
import { DetailComponent } from './detail/detail.component';
import { CycleFlagPipe } from './subject/cycle-flag.pipe';
import { FeeDataTypePipe } from './subject/fee-data-type.pipe';
import { ChargeStatusPipe } from './charge/charge-status.pipe';
import { PayStatusPipe } from './detail/pay-status.pipe';

const routes: Routes = [
    { path: 'subject', component: SubjectComponent },
    { path: 'charge', component: ChargeComponent },
    { path: 'detail', component: DetailComponent }
    // { path: 'charge', component: ChargeComponent },
    // { path: 'detail', component: DetailComponent }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        SubjectComponent,
        CycleFlagPipe,
        FeeDataTypePipe,
        ChargeComponent,
        ChargeStatusPipe,
        DetailComponent,
        PayStatusPipe
    ],
    exports: [
        RouterModule
    ],
    entryComponents: [

    ]
})
export class chargeManageModule { }
