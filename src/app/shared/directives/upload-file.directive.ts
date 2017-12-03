// tslint:disable
import {NzMessageService} from 'ng-zorro-antd';
import {Directive, ElementRef, Input, Output, EventEmitter, HostListener} from '@angular/core';
import {_HttpClient} from '@core/services/http.client';
import {SettingsService} from '@core/services/settings.service';

/**
 * 文件上传
 *
 */
@Directive({selector: '[upload-file]'})
export class UploadFileDirective {

    @Output() statusChange: EventEmitter<any> = new EventEmitter<any>();

    token = null;

    constructor(private el: ElementRef,
                private http: _HttpClient,
                private settings: SettingsService,
                private msgSrv: NzMessageService) {

        this.http.get('/pm/aliyun/ossTempToken').subscribe((data: any) => {
            this.token = data;
            console.log(this.token);
        }, (err: any) => {
            console.log(err);
        });
    }

    @HostListener('change')
    _change() {
        const files = this.el.nativeElement.files;
        let file = null;

        [].forEach.call(files, (f) => {
            file = f;
        });

        if (file) {
            this.statusChange.emit({
                type: 'uploading'
            });

            let client = new OSS.Wrapper({
                accessKeyId: this.token.accessKeyId,
                accessKeySecret: this.token.accessKeySecret,
                stsToken: this.token.stsToken,
                endpoint: this.token.endpoint,
                bucket: this.token.bucket
            });
            let saveAs = this.settings.user.username + '-' + file.name;
            client.multipartUpload(saveAs, file).then((result) => {
                const fileUrl = result.url || '';
                console.log('file upload success: ' + fileUrl);

                if (fileUrl) {
                    this.statusChange.emit({
                        type: 'uploaded',
                        data: {
                            name: saveAs,
                            url: fileUrl
                        }
                    });
                }else {
                    this.statusChange.emit({
                        type: 'error',
                        data: {
                            msg: '获取文件上传结果异常，请稍后重试！'
                        }
                    });
                }
            }).catch((err) => {
                console.log(err);

                this.statusChange.emit({
                    type: 'error',
                    data: {
                        msg: '文件上传失败，请稍后重试！'
                    }
                });
            });
        }
    }
}
