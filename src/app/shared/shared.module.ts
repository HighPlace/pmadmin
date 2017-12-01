import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AngularWebStorageModule } from 'angular-web-storage';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { TranslateModule } from '@ngx-translate/core';

import { SparklineDirective } from './directives/sparkline/sparkline.directive';
import { DownFileDirective } from '@shared/directives/down-file.directive';
import { MomentDatePipe } from './pipes/moment-date.pipe';
import { CNCurrencyPipe } from './pipes/cn-currency.pipe';
import { KeysPipe } from './pipes/keys.pipe';
import { YNPipe } from './pipes/yn.pipe';
import { DataOperPipe } from '@shared/pipes/data-oper.pipe';
import { ModalHelper } from './helper/modal.helper';
import {UploadFileComponent} from '@shared/component/upload-file.component';
import {UploadFileDirective} from '@shared/directives/upload-file.directive';

const DIRECTIVES = [SparklineDirective, DownFileDirective, UploadFileDirective];
const COMPONENT = [UploadFileComponent];
const PIPES = [MomentDatePipe, CNCurrencyPipe, KeysPipe, YNPipe, DataOperPipe];
const HELPERS = [ ModalHelper ];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        AngularWebStorageModule,
        NgZorroAntdModule.forRoot()
    ],
    declarations: [...DIRECTIVES, ...PIPES, ...COMPONENT],
    providers: [ ...HELPERS ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        RouterModule,
        AngularWebStorageModule,
        TranslateModule,

        ...DIRECTIVES,
        ...PIPES,
        ...COMPONENT
    ]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule
        };
    }
}
