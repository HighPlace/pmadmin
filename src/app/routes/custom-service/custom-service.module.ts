import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';
import { NoticeComponent} from './notice/notice.component';
import { NoticeStatusPipe } from './notice/notice-status.pipe';
import { NumFormatPipe } from './notice/num.pipe';
import { RequestComponent} from './request/request.component';
import { RequestSourcePipe } from './request/request-source.pipe';
import { RequestStatusPipe } from './request/request-status.pipe';
import { RequestPriorityPipe } from './request/request-priority.pipe';

const routes: Routes = [
    { path: 'notice', component: NoticeComponent },
    { path: 'request', component: RequestComponent }
    // { path: 'owner', component: OwnerComponent }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        NoticeComponent,
        NoticeStatusPipe,
        NumFormatPipe,
        RequestComponent,
        RequestSourcePipe,
        RequestStatusPipe,
        RequestPriorityPipe
    ],
    exports: [
        RouterModule
    ],
    entryComponents: [

    ]
})
export class CustomServiceModule { }
