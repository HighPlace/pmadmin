import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {NzMessageService, NzNotificationService, NzModalService} from 'ng-zorro-antd';
import {_HttpClient} from '@core/services/http.client';
import {SettingsService} from '@core/services/settings.service';
import {statusList, payStatusList, payTypeList, Detail} from './data-model';
import * as moment from 'moment';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html'
})
export class DetailComponent implements OnInit {

    billIdList: any[] = [];
    filterStatusList: any[] = [];
    filterPayStatusList: any[] = [];
    filter: any = {
        billId: null,
        billPeriod: null,
        status: -1
    };

    list: Detail[] = [];
    loading = false;
    total = 0;
    pageIndex = 1;
    pageSize = 10;
    sortField = 'billPeriod';
    sortType = 'desc';
    sortMap = {
        billPeriod   : 'descend',
        amount  : null
    };

    valForm: FormGroup;
    isVisible = false;
    isConfirmLoading = false;
    maskClosable = false;
    dialogStatus = 'view'; // edit add
    curDetail = new Detail();
    curDetailIte

    constructor(private http: _HttpClient,
                private msg: NzMessageService,
                private setting: SettingsService,
                fb: FormBuilder) {
        this.filterStatusList = [{value: -1, label: '全部'}].concat(statusList);
        this.filterPayStatusList = [{value: -1, label: '全部'}].concat(payStatusList);
        this.valForm = fb.group({
            billId: [null, Validators.required],
            billName: [null, Validators.required],
            billPeriod: [null, Validators.required]
        });

    }

    ngOnInit() {
        this.getFilter();
        this.load();
    }

    getFilter() {
        this.http.get('/pm/charge/bill/catalog')
            .subscribe((data: any) => {
                this.billIdList = data.data || [];
            }, (err: any) => {
                this.showErr();
                console.log(err);
            });
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

        if (this.filter.billId > 0) {
            params.billId = this.filter.billId;
        }
        if (this.filter.billPeriod) {
            params.billPeriod = moment(this.filter.billPeriod).format('YYYY-MM');
        }
        if (this.filter.status >= 0) {
            params.status = this.filter.status;
        }
        if (this.filter.payStatus >= 0) {
            params.payStatus = this.filter.payStatus;
        }

        this.http.get('/pm/charge/detail', params).subscribe((data: any) => {
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

    openDetail(data: Detail, isEdit: boolean) {
        this.curDetail = new Detail();

        if (isEdit) {
            this.dialogStatus = 'edit';
            this.maskClosable = false;
            this.curDetail = Object.assign({}, data);
        } else if (data.chargeId) {
            this.dialogStatus = 'view';
            this.maskClosable = true;
            this.curDetail = Object.assign({}, data);
        } else {
            this.dialogStatus = 'add';
            this.maskClosable = false;
        }
        this.valForm.reset(this.curDetail);
        this.isVisible = true;
    }

    handleCancel(e) {
        this.isVisible = false;
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
