import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {NzMessageService, NzNotificationService, NzModalService} from 'ng-zorro-antd';
import {_HttpClient} from '@core/services/http.client';
import {SettingsService} from '@core/services/settings.service';
import {sourceList, statusList, priorityList, rateLevelList, Request} from './data-model';

@Component({
    selector: 'app-request',
    templateUrl: './request.component.html'
})
export class RequestComponent implements OnInit {
    types: any[] = [];
    subTypes: any[] = [];
    filter: any = {
        type: '',
        subType: '',
        source: -1,
        status: -1,
        priority: -1,
        requestDateFrom: null,
        requestDateTo: null
    };

    filterSourceList: any[] = [];
    sourceList: any[] = [];
    filterStatusList: any[] = [];
    statusList: any[] = [];
    filterPriorityList: any[] = [];
    priorityList: any[] = [];
    rateLevelList: any[] = [];

    list: Request[] = [];
    loading = false;
    total = 0;
    pageIndex = 1;
    pageSize = 10;
    sortField = 'requestId';
    sortType = 'desc';
    sortMap = {
        requestId   : null,
        startTime    : null
    };

    valForm: FormGroup;
    isVisible = false;
    isConfirmLoading = false;
    maskClosable = false;
    dialogStatus = 'view'; // edit add
    curRequest = new Request();

    constructor(private http: _HttpClient,
                private msg: NzMessageService,
                private setting: SettingsService,
                fb: FormBuilder) {

        this.filterSourceList = [{value: -1, label: '全部'}].concat(sourceList);
        this.sourceList = sourceList;
        this.filterStatusList = [{value: -1, label: '全部'}].concat(statusList);
        this.statusList = statusList;
        this.filterPriorityList = [{value: -1, label: '全部'}].concat(priorityList);
        this.priorityList = priorityList;
        this.rateLevelList = rateLevelList;

        this.valForm = fb.group({
            type: [null, Validators.required],
            subType: [null, Validators.required],
            source: [null, Validators.required],
            content: [null, Validators.required],
            attachment1: [null, null],
            propertyId: [null, null],
            submitter: [null, null],
            contactInfo: [null, null],
            priority: [null, null],
            startTime: [null, null]
        });

    }

    ngOnInit() {
        this.getFilter();
        this.load();
    }

    getFilter() {
        this.http.get('/pm/request/type')
            .subscribe((data: any) => {
                this.types = data.data || [];

                if (this.filter.type) {
                    this.setSubtypes(this.filter.type);
                }

            }, (err: any) => {
                this.showErr();
                console.log(err);
            });
    }

    setSubtypes(type: string) {
        for (let i = 0; i < this.types.length; i++) {
            if (this.types[i].type === type) {
                this.subTypes = this.types[i].subType;
                break;
            }
        }
    }

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

        if (this.filter.type) {
            params.type = this.filter.type;
        }

        if (this.filter.subType) {
            params.subType = this.filter.subType;
        }

        if (this.filter.source) {
            params.source = this.filter.source;
        }

        if (this.filter.status) {
            params.status = this.filter.status;
        }

        if (this.filter.priority) {
            params.priority = this.filter.priority;
        }

        if (this.filter.requestDateFrom) {
            params.requestDateFrom = this.filter.requestDateFrom;
        }

        if (this.filter.requestDateTo) {
            params.requestDateTo = this.filter.requestDateTo;
        }

        this.http.get('/pm/request', params).subscribe((data: any) => {
            this.loading = false;
            this.total = data.totalCount || 0;
            this.list = data.data || [];
        }, (err: any) => {
            this.showErr();
            console.log(err);
        });
    }

    startValueChange = () => {
        if (this.filter.requestDateFrom > this.filter.requestDateTo) {
            this.filter.requestDateTo = null;
        }
    };
    endValueChange = () => {
        if (this.filter.requestDateFrom > this.filter.requestDateTo) {
            this.filter.requestDateFrom = null;
        }
    };
    disabledStartDate = (startValue) => {
        if (!startValue || !this.filter.requestDateTo) {
            return false;
        }
        return startValue >= this.filter.requestDateTo;
    };
    disabledEndDate = (endValue) => {
        if (!endValue || !this.filter.requestDateFrom) {
            return false;
        }
        return endValue <= this.filter.requestDateFrom;
    };

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

    openDetail(data: Request, isEdit: boolean) {
        this.curRequest = new Request();

        if (isEdit) {
            this.dialogStatus = 'edit';
            this.maskClosable = false;
            this.curRequest = Object.assign({}, data);
        } else if (data.requestId) {
            this.dialogStatus = 'view';
            this.maskClosable = true;
            this.curRequest = Object.assign({}, data);
        } else {
            this.dialogStatus = 'add';
            this.maskClosable = false;
        }

        this.valForm.reset(this.curRequest);
        this.isVisible = true;
    }

    handleOk(e) {
        this.isConfirmLoading = true;

        if (this.dialogStatus === 'add') {
            this.http.post('/pm/request', this.valForm.value)
                .subscribe((data: any) => {
                    this.isConfirmLoading = false;
                    this.isVisible = false;
                    this.getFilter();
                    this.load();
                }, (err: any) => {
                    this.isConfirmLoading = false;
                    this.showErr();
                    console.log(err);
                });
        } else if (this.dialogStatus === 'edit') {
            this.http.put('/pm/request', Object.assign({}, this.valForm.value, {requestId: this.curRequest.requestId}))
                .subscribe((data: any) => {
                    this.isConfirmLoading = false;
                    this.isVisible = false;
                    this.getFilter();
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

    deleteData(request: Request) {
        this.http.delete('/pm/request', {requestId: request.requestId})
            .subscribe((data: any) => {
                this.getFilter();
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
