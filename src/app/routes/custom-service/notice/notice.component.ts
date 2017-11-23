import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {NzMessageService, NzNotificationService, NzModalService} from 'ng-zorro-antd';
import {_HttpClient} from '@core/services/http.client';
import {SettingsService} from '@core/services/settings.service';
import {statusList, Notice} from './data-model';

@Component({
    selector: 'app-notice',
    templateUrl: './notice.component.html'
})
export class NoticeComponent implements OnInit {
    typeSearchOptions: any[] = [];
    filterStatusList: any[] = [];
    filter: any = {
        title: '',
        type: '',
        publishDateFrom: '',
        publishDateTo: '',
        status: -1
    };

    list: Notice[] = [];
    loading = false;
    total = 0;
    pageIndex = 1;
    pageSize = 10;

    valForm: FormGroup;
    isVisible = false;
    isConfirmLoading = false;
    maskClosable = false;
    dialogStatus = 'view'; // edit add
    curNotice = new Notice();

    constructor(private http: _HttpClient,
                private msg: NzMessageService,
                private setting: SettingsService,
                fb: FormBuilder) {
        this.filterStatusList = [{value: -1, label: '全部'}].concat(statusList);

        this.valForm = fb.group({
            title: [null, null],
            type: [null, Validators.required],
            content: [null, Validators.required],
            validDate: [null, Validators.required]
        });

    }

    ngOnInit() {
        this.load();
    }

    titleSearchChange(value) {

    }

    load(reset?: boolean) {
        if (reset) {
            this.pageIndex = 1;
        }
        this.loading = true;

        const params: any = {
            pageNum: this.pageIndex,
            pageSize: this.pageSize,
            sortField: 'createTime',
            sortType: 'desc'
        };

        if (this.filter.zone) {
            params.zoneId = this.filter.zone;
        }
        if (this.filter.building) {
            params.buildingId = this.filter.building;
        }
        if (this.filter.unit) {
            params.unitId = this.filter.unit;
        }
        if (this.filter.room) {
            params.roomId = this.filter.room;
        }
        if (this.filter.status >= 0) {
            params.status = this.filter.status;
        }

        this.http.get('/pm/property', params).subscribe((data: any) => {
            this.loading = false;
            this.total = data.totalCount || 0;
            this.list = data.data || [];
        }, (err: any) => {
            this.showErr();
            console.log(err);
        });
    }

    openDetail(data: Notice, isEdit: boolean) {
        this.curNotice = new Notice();

        if (isEdit) {
            this.dialogStatus = 'edit';
            this.maskClosable = false;
            this.curNotice = Object.assign({}, data);
        } else if (data.propertyId) {
            this.dialogStatus = 'view';
            this.maskClosable = true;
            this.curNotice = Object.assign({}, data);
        } else {
            this.dialogStatus = 'add';
            this.maskClosable = false;
        }

        this.valForm.reset(this.curNotice);
        this.isVisible = true;
    }

    handleOk(e) {
        this.isConfirmLoading = true;

        if (this.dialogStatus === 'add') {
            this.http.post('/pm/property', this.valForm.value)
                .subscribe((data: any) => {
                    this.isConfirmLoading = false;
                    this.isVisible = false;
                    this.load();
                }, (err: any) => {
                    this.isConfirmLoading = false;
                    this.showErr();
                    console.log(err);
                });
        } else if (this.dialogStatus === 'edit') {
            this.http.put('/pm/property', Object.assign({}, this.valForm.value, {propertyId: this.curNotice.propertyId}))
                .subscribe((data: any) => {
                    this.isConfirmLoading = false;
                    this.isVisible = false;
                    this.load();
                }, (err: any) => {
                    this.isConfirmLoading = false;
                    this.showErr();
                    console.log(err);
                });
        }
    }

    handleCancel(e) {
        this.isVisible = false;
    }

    deleteData(notice: Notice) {
        this.http.delete('/pm/property', {propertyId: notice.propertyId})
            .subscribe((data: any) => {
                this.load();
            }, (err: any) => {
                if (err.status !== 200) {
                    this.showErr();
                } else {
                    this.load();
                }
                console.log(err);
            });
    }

    getFormControl(name) {
        return this.valForm.controls[name];
    }

    showErr() {
        this.msg.create(
            'error',
            '请求失败，请稍后重试，或联系管理员！',
            {
                nzDuration: 3 * 1000
            }
        );
    }
}
