import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';
import { HourseComponent} from './hourse/hourse.component';
import { RoomStatusPipe } from './hourse/room-status.pipe';
import { NumFormatPipe } from './hourse/num.pipe';
import { CustomerComponent } from './customer/customer.component';
import { ChargeStatusPipe } from './customer/charge-status.pipe';
import { CarTypePipe } from './customer/car-type.pipe';
import { IdentityTypePipe } from './customer/identity-type.pipe';
import { RelationTypePipe } from './customer/relation-type.pipe';

const routes: Routes = [
    { path: 'hourse', component: HourseComponent },
    { path: 'customer', component: CustomerComponent }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        HourseComponent,
        CustomerComponent,
        //
        RoomStatusPipe,
        NumFormatPipe,
        ChargeStatusPipe,
        CarTypePipe,
        IdentityTypePipe,
        RelationTypePipe
    ],
    exports: [
        RouterModule
    ],
    entryComponents: [

    ]
})
export class FixedAssetsModule { }
