import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';
import { SubjectComponent} from './subject/subject.component';
import { CycleFlagPipe } from './subject/cycle-flag.pipe';
import { FeeDataTypePipe } from './subject/fee-data-type.pipe';

const routes: Routes = [
    { path: 'subject', component: SubjectComponent },
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
        FeeDataTypePipe
    ],
    exports: [
        RouterModule
    ],
    entryComponents: [

    ]
})
export class chargeManageModule { }
