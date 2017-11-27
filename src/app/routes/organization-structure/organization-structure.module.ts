import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';
import { EmployeeStatusPipe } from './employee/employee-status.pipe';
import { DepartmentStatusPipe } from './department/department-status.pipe';
import { DepartmentComponent } from './department/department.component';
import { EmployeeComponent } from './employee/employee.component';

const routes: Routes = [
    { path: 'department', component: DepartmentComponent },
    { path: 'employee', component: EmployeeComponent }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        DepartmentComponent,
        EmployeeComponent,

        EmployeeStatusPipe,
        DepartmentStatusPipe
    ],
    exports: [
        RouterModule
    ],
    entryComponents: [

    ]
})
export class OrganizationStructureModule { }
