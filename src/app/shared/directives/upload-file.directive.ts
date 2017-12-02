// tslint:disable
import { NzMessageService } from 'ng-zorro-antd';
import { Directive, ElementRef, Input, HostListener } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';
import { saveAs } from 'file-saver';
import { _HttpClient } from '@core/services/http.client';

/**
 * 文件上传
 *
 */
@Directive({ selector: '[upload-file]' })
export class UploadFileDirective {

    constructor(
        private el: ElementRef,
        private _http: _HttpClient,
        private msgSrv: NzMessageService) {
    }

    @HostListener('change') _change() {
        const files = this.el.nativeElement.files;

        [].forEach.call(files, (file) => {
            console.log(file.name);
        })
    }
}
