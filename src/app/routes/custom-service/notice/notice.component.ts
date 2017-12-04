import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {NzMessageService, NzNotificationService, NzModalService} from 'ng-zorro-antd';
import {_HttpClient} from '@core/services/http.client';
import {SettingsService} from '@core/services/settings.service';
import {statusList, Notice} from './data-model';
import * as moment from 'moment';

@Component({
    selector: 'app-notice',
    templateUrl: './notice.component.html'
})
export class NoticeComponent implements OnInit {
    titleSearchOptions: any[] = [];
    typeSearchOptions: any[] = [];
    filterStatusList: any[] = [];
    filter: any = {
        title: '',
        type: '',
        publishDateFrom: null,
        publishDateTo: null,
        status: -1
    };

    list: Notice[] = [];
    loading = false;
    total = 0;
    pageIndex = 1;
    pageSize = 10;
    sortField = 'publishDate';
    sortType = 'desc';
    sortMap = {
        publishDate   : 'descend'
    };

    valForm: FormGroup;
    isVisible = false;
    isConfirmLoading = false;
    maskClosable = false;
    dialogStatus = 'view'; // edit add
    curNotice = new Notice();
    newTypeOption = null;

    constructor(private http: _HttpClient,
                private msg: NzMessageService,
                private setting: SettingsService,
                fb: FormBuilder) {
        this.filterStatusList = [{value: -1, label: '全部'}].concat(statusList);
        this.valForm = fb.group({
            title: [null, Validators.required],
            type: [null, Validators.required],
            content: [null, Validators.required],
            validDate: [null, null]
        });

    }

    ngOnInit() {
        this.initSearch();
        this.load();
    }

    initSearch() {
        //this.titleSearchChange('');
        this.typeSearchChange('');
    }

    titleSearchChange(value) {
        if (value) {
            this.http.get('/pm/notice/title', {input: value}).subscribe((data: any) => {
                this.titleSearchOptions = data.data || [];
            }, (err: any) => {
                this.showErr();
                console.log(err);
            });
        }else {
            this.titleSearchOptions = [];
        }
    }

    typeSearchChange(value) {
        this.http.get('/pm/notice/type', {input: value}).subscribe((data: any) => {
            this.typeSearchOptions = data.data || [];
        }, (err: any) => {
            this.showErr();
            console.log(err);
        });
    }

    startValueChange = () => {
        if (this.filter.publishDateFrom > this.filter.publishDateTo) {
            this.filter.publishDateTo = null;
        }
    };
    endValueChange = () => {
        if (this.filter.publishDateFrom > this.filter.publishDateTo) {
            this.filter.publishDateFrom = null;
        }
    };
    disabledStartDate = (startValue) => {
        if (!startValue || !this.filter.publishDateTo) {
            return false;
        }
        return startValue >= this.filter.publishDateTo;
    };
    disabledEndDate = (endValue) => {
        if (!endValue || !this.filter.publishDateFrom) {
            return false;
        }
        return endValue <= this.filter.publishDateFrom;
    };

    load(reset?: boolean) {
        if (reset) {
            this.pageIndex = 1;
        }
        this.loading = true;

        const params: any = {
            pageNum: this.pageIndex,
            pageSize: this.pageSize,
            sortField: this.sortField,
            sortType: this.sortType
        };

        if (this.filter.title) {
            params.title = this.filter.title;
        }
        if (this.filter.type) {
            params.type = this.filter.type;
        }
        if (this.filter.publishDateFrom) {
            params.publishDateFrom = moment(this.filter.publishDateFrom).format('YYYY-MM-DD');
        }
        if (this.filter.publishDateTo) {
            params.publishDateTo = moment(this.filter.publishDateTo).format('YYYY-MM-DD');
        }
        if (this.filter.status >= 0) {
            params.status = this.filter.status;
        }

        this.http.get('/pm/notice', params).subscribe((data: any) => {
            this.loading = false;
            this.total = data.totalCount || 0;
            this.list = data.data || [];

        }, (err: any) => {
            this.showErr();
            console.log(err);
        });
    }

    sort(sortName, value) {
        this.sortField = sortName;
        if (value  === 'ascend') {
            this.sortType = 'asc';
        } else {
            this.sortType = 'desc';
        }
        Object.keys(this.sortMap).forEach(key => {
            if (key !== sortName) {
                this.sortMap[ key ] = null;
            } else {
                this.sortMap[ key ] = value;
            }
        });
        this.load(true);
    }

    openDetail(data: Notice, isEdit: boolean) {
        this.curNotice = new Notice();

        if (isEdit) {
            this.dialogStatus = 'edit';
            this.maskClosable = false;
            this.curNotice = Object.assign({}, data);
        } else if (data.noticeId) {
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

    handleOk(e, isRelease?) {
        this.isConfirmLoading = true;

        if (this.dialogStatus === 'add') {
            const newNotice = new Notice();
            if (isRelease) {
                newNotice.status = 1;
                newNotice.publishDate = Date.now();
            }
            this.http.post('/pm/notice', Object.assign(newNotice, this.valForm.value))
                .subscribe((data: any) => {
                    this.isConfirmLoading = false;
                    this.isVisible = false;
                    this.initSearch();
                    this.load();
                }, (err: any) => {
                    this.isConfirmLoading = false;
                    this.showErr();
                    console.log(err);
                });
        } else if (this.dialogStatus === 'edit') {
            const newNotice = Object.assign({}, this.curNotice);
            if (isRelease) {
                newNotice.status = 1;
                newNotice.publishDate = Date.now();
            }
            this.http.put('/pm/notice', Object.assign(newNotice, this.valForm.value))
                .subscribe((data: any) => {
                    this.isConfirmLoading = false;
                    this.isVisible = false;
                    this.initSearch();
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
        this.initSearch();
    }

    releaseData(notice: Notice) {
        const newNotice = Object.assign({}, notice);
        newNotice.status = 1;
        newNotice.publishDate = Date.now();
        this.http.put('/pm/notice', newNotice)
            .subscribe((data: any) => {
                this.load();
            }, (err: any) => {
                this.showErr();
                console.log(err);
            });
    }

    deleteData(notice: Notice) {
        this.http.delete('/pm/notice', {noticeId: notice.noticeId})
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

    // ------------nzSelect 可选择可输入改造 begin
    get typeOptions() {
        if (this.newTypeOption) {
            return [this.newTypeOption, ...this.typeSearchOptions];
        } else {
            return this.typeSearchOptions;
        }
    }

    typeChange($event) {
        if (!$event) {
            this.newTypeOption = null;
            return;
        }
        if ($event && this.typeSearchOptions.findIndex(e => e === $event) === -1) {
            this.newTypeOption = $event;
        }
    }

    typeOpenChange(isOpen) {
        if (this.newTypeOption && !isOpen) {
            this.typeSearchOptions.push(this.newTypeOption);
            setTimeout(() => {
                this.valForm.patchValue({
                    type: this.typeSearchOptions[this.typeSearchOptions.length - 1]
                });
            }, 100);
            this.newTypeOption = null;
        }
    }
    // ------------end

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
