import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';
import { HourseComponent} from './notice/notice.component';
import { RoomStatusPipe } from './notice/notice-status.pipe';
import { NumFormatPipe } from './notice/num.pipe';

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
