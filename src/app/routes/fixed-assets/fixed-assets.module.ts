import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';
import { HourseComponent} from './hourse/hourse.component';
import { RoomStatusPipe } from './hourse/room-status.pipe';
import { NumFormatPipe } from './hourse/num.pipe';
import { EmployeeStatusPipe } from './employee/employee-status.pipe';
import { DepartmentComponent } from './department/department.component';
import { EmployeeComponent } from './employee/employee.component';

const routes: Routes = [
    { path: 'hourse', component: HourseComponent },
    { path: 'department', component: DepartmentComponent },
    { path: 'employee', component: EmployeeComponent }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        HourseComponent,
        DepartmentComponent,
        EmployeeComponent,
        RoomStatusPipe,
        NumFormatPipe,
        EmployeeStatusPipe
    ],
    exports: [
        RouterModule
    ],
    entryComponents: [

    ]
})
export class FixedAssetsModule { }
