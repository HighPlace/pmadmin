import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';
import { NoticeComponent} from './notice/notice.component';
import { NoticeStatusPipe } from './notice/notice-status.pipe';
import { NumFormatPipe } from './notice/num.pipe';

const routes: Routes = [
    { path: 'notice', component: NoticeComponent },
    // { path: 'owner', component: OwnerComponent }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        NoticeComponent,
        // OwnerComponent

        NoticeStatusPipe,
        NumFormatPipe
    ],
    exports: [
        RouterModule
    ],
    entryComponents: [

    ]
})
export class CustomServiceModule { }
