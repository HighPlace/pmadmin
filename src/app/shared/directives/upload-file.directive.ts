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

    token = null;
    taskId = null;
    taskResult = null;

    constructor(
        private el: ElementRef,
        private http: _HttpClient,
        private msgSrv: NzMessageService) {

        this.http.get('/pm/aliyun/ossTempToken').subscribe((data: any) => {
            this.token = data;
            console.log(this.token);
        }, (err: any) => {
            console.log(err);
        });
    }

    @HostListener('change') _change() {
        const files = this.el.nativeElement.files;
        let file = null;

        [].forEach.call(files, (f) => {
            file = f;
        });

        if (file) {
            let client = new OSS.Wrapper({
                accessKeyId: this.token.accessKeyId,
                accessKeySecret: this.token.accessKeySecret,
                stsToken: this.token.stsToken,
                endpoint: this.token.endpoint,
                bucket: this.token.bucket
            });
            client.multipartUpload(file.name, file).then((result)=> {
                const fileUrl = result.url || '';
                console.log(fileUrl);

                if (fileUrl) {
                    this.http.post('/pm/property/import', {}, {fileUrl: file.name, vendor: 1}).subscribe((data: any) => {
                        if (data.taskId) {
                            this.taskId = data.taskId;
                            this.taskResult = null;
                        }
                        console.log(data);

                        this.getImportStatus();

                    }, (err: any) => {
                        console.log(err);
                    });
                }
            }).catch((err)=> {
                console.log(err);
            });
        }
    }

    getImportStatus() {
        this.http.get('/pm/property/import', {taskId: this.taskId}).subscribe((data: any) => {
            this.taskResult = data || {};
            console.log(data);

            if (this.taskResult.status <= 0) {
                setTimeout(()=>{
                    this.getImportStatus()
                }, 3000);
            }else {
                alert(this.taskResult.result.resultMessage);
            }

        }, (err: any) => {
            console.log(err);
        });
    }
}
