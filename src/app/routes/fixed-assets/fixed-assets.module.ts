import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';
import { HourseComponent} from './hourse/hourse.component';

const routes: Routes = [
    { path: 'hourse', component: HourseComponent },
    // { path: 'owner', component: OwnerComponent }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        HourseComponent,
        // OwnerComponent
    ],
    exports: [
        RouterModule
    ],
    entryComponents: [

    ]
})
export class FixedAssetsModule { }
