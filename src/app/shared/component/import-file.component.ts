import { Component, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { _HttpClient } from '@core/services/http.client';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-import-file',
    templateUrl: './import-file.component.html'
})
export class ImportFileComponent implements OnChanges {

    @Input() isVisible: boolean;
    @Output() dealAction = new EventEmitter<any>();
    taskId = null;
    taskResult = null;
    processing = false;
    progressStatus = 'active';
    progressValue = 0;
    progressMsg = '';

    constructor(private http: _HttpClient,
                private msgSrv: NzMessageService) {

    }

    ngOnChanges() {
        console.log(this.isVisible);
    }

    onStatusChange(status) {
        const data = status.data || {};
        switch (status.type) {
            case 'uploading':
                this.processing = true;
                this.progressStatus = 'active';
                this.progressValue = 10;
                this.progressMsg = data.msg || '正在上传文件...';
                break;
            case 'uploaded':
                this.submitTask(data);
                this.progressValue = 30;
                this.progressMsg = data.msg || '文件上传成功...';
                break;
            case 'submitTask':
                this.progressValue = 50;
                this.progressMsg = data.msg || '正在提交导入任务...';
                break;
            case 'queryTask':
                this.progressValue = 70;
                this.progressMsg = data.msg || '正在查询任务结果...';
                break;
            case 'success':
                this.progressStatus = 'success';
                this.progressValue = 100;
                this.progressMsg = data.msg || '批量导入成功！';
                break;
            case 'error':
                this.progressStatus = 'exception';
                this.progressMsg = data.msg || '批量导入失败，稍后请重试！';
                break;
            case 'confirm':
                this.processing = false;
                this.progressStatus = 'active';
                this.progressValue = 0;
                this.progressMsg = '';
                break;
        }
    }

    submitTask(fileInfo: any) {
        this.onStatusChange({type: 'submitTask'});
        this.http.post('/pm/property/import', {}, {fileUrl: fileInfo.name, vendor: 1}).subscribe((data: any) => {
            if (data.taskId) {
                this.taskId = data.taskId;
                this.taskResult = null;
            }
            console.log(data);

            this.onStatusChange({type: 'queryTask'});
            this.getImportStatus();

        }, (err: any) => {
            console.log(err);
            this.onStatusChange({type: 'error', data: {msg: '导入任务提交失败！'}});
        });
    }

    getImportStatus() {
        this.http.get('/pm/property/import', {taskId: this.taskId}).subscribe((data: any) => {
            this.taskResult = data || {};
            console.log(data);

            if (this.taskResult.status <= 0) {
                setTimeout(() => {
                    this.getImportStatus();
                }, 3000);
            }else {
                const result = this.taskResult.result || {};
                if (result.resultCode === 0) {
                    this.msgSrv.success('导入成功！');
                    this.onStatusChange({type: 'success', data: {msg: '导入成功！'}});
                }else {
                    this.msgSrv.error('导入失败：' + result.resultMessage, {nzDuration: 3000});
                    this.onStatusChange({type: 'error', data: {msg: result.resultMessage}});
                }
            }

        }, (err: any) => {
            console.log(err);
            this.onStatusChange({type: 'error', data: {msg: '导入任务查询失败！'}});
        });
    }

    handleCancel(e) {
        this.dealAction.emit({type: 'close'});
    }

    handleOk(e) {
        this.dealAction.emit({type: 'close'});
        this.onStatusChange({type: 'confirm'});
    }

    beginUpload(status) {
        this.onStatusChange(status);
        // alert('1');
    }

    afterUpload(status) {
        this.onStatusChange(status);
        // alert('2');
    }
}
