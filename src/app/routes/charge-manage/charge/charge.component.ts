import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {NzMessageService, NzNotificationService, NzModalService} from 'ng-zorro-antd';
import {_HttpClient} from '@core/services/http.client';
import {SettingsService} from '@core/services/settings.service';
import {statusList, Charge} from './data-model';
import * as moment from 'moment';

@Component({
    selector: 'app-charge',
    templateUrl: './charge.component.html'
})
export class ChargeComponent implements OnInit {

    billIdList: any[] = [];
    filterStatusList: any[] = [];
    filter: any = {
        billId: null,
        billPeriod: null,
        status: -1
    };

    list: Charge[] = [];
    loading = false;
    total = 0;
    pageIndex = 1;
    pageSize = 10;
    sortField = 'billPeriod';
    sortType = 'desc';
    sortMap = {
        billPeriod   : 'descend',
        totalAmount  : null,
        receivedAmount : null
    };

    valForm: FormGroup;
    isVisible = false;
    isConfirmLoading = false;
    maskClosable = false;
    dialogStatus = 'view'; // edit add
    curCharge = new Charge();

    constructor(private http: _HttpClient,
                private msg: NzMessageService,
                private setting: SettingsService,
                fb: FormBuilder) {
        this.filterStatusList = [{value: -1, label: '全部'}].concat(statusList);
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

        this.http.get('/pm/charge', params).subscribe((data: any) => {
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

    openDetail(data: Charge, isEdit: boolean) {
        this.curCharge = new Charge();

        if (isEdit) {
            this.dialogStatus = 'edit';
            this.maskClosable = false;
            this.curCharge = Object.assign({}, data);
        } else if (data.chargeId) {
            this.dialogStatus = 'view';
            this.maskClosable = true;
            this.curCharge = Object.assign({}, data);
        } else {
            this.dialogStatus = 'add';
            this.maskClosable = false;
        }

        this.valForm.reset(this.curCharge);
        this.isVisible = true;
    }

    handleOk(e) {
        this.isConfirmLoading = true;

        if (this.dialogStatus === 'add') {
            this.http.post('/pm/charge', this.valForm.value)
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
            this.http.put('/pm/charge', Object.assign({}, this.valForm.value, {chargeId: this.curCharge.chargeId}))
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

    deleteData(charge: Charge) {
        this.http.delete('/pm/charge', {chargeId: charge.chargeId})
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
