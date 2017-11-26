import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';
import { HourseComponent} from './hourse/hourse.component';
import { RoomStatusPipe } from './hourse/room-status.pipe';
import { NumFormatPipe } from './hourse/num.pipe';
import { DepartmentComponent } from './department/department.component';

const routes: Routes = [
    { path: 'hourse', component: HourseComponent },
    { path: 'department', component: DepartmentComponent }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        HourseComponent,
        DepartmentComponent,

        RoomStatusPipe,
        NumFormatPipe
    ],
    exports: [
        RouterModule
    ],
    entryComponents: [

    ]
})
export class FixedAssetsModule { }
