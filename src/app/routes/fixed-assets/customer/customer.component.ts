import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {NzMessageService, NzNotificationService, NzModalService} from 'ng-zorro-antd';
import {_HttpClient} from '@core/services/http.client';
import {SettingsService} from '@core/services/settings.service';
import {
    identityTypeList, genderList, relationTypeList, carTypeList, chargeStatusList, Customer, Relation,
    Car, propertyStatusList
} from './data-model';

@Component({
    selector: 'app-customer',
    templateUrl: './customer.component.html'
})

export class CustomerComponent implements OnInit {
    zones: any[] = [];
    buildings: any[] = [];
    units: string[] = [];
    filterStatusList: any[] = [];
    statusList: any[] = [];
    identityTypeList: any[] = [];
    genderList: any[] = [];
    sampleUrl = '';
    filter: any = {
        zone: '',
        building: '',
        unit: '',
        room: '',
        status: -1,
        customerName: '',
        phone: '',
        plateNo: ''
    };

    list: Customer[] = [];
    loading = false;
    total = 0;
    pageIndex = 1;
    pageSize = 10;
    sortField = 'customerId';
    sortType = 'asc';
    sortMap = {
        customerId   : 'ascend',
        customerName : null,
        phone : null,
        identityNo : null
    };

    valForm: FormGroup;
    isVisible = false;
    isConfirmLoading = false;
    maskClosable = false;
    dialogStatus = 'view'; // edit add
    curCustomer = new Customer();

    constructor(private http: _HttpClient,
                private msg: NzMessageService,
                private setting: SettingsService,
                fb: FormBuilder) {
        this.filterStatusList = [{value: -1, label: '全部'}].concat(propertyStatusList);
        this.statusList = propertyStatusList;
        this.identityTypeList = identityTypeList;
        this.genderList = genderList;

        this.valForm = fb.group({
            customerName: [null, Validators.required],
            identityType: [null, null],
            identityNo: [null, Validators.required],
            phone: [null, Validators.required],
            email: [null, null],
            gender: [null, null],
            backupPhone1: [null, null]
        });

    }

    ngOnInit() {
        this.getFilter();
        this.load();
    }

    getFilter() {
        this.http.get('/pm/property/catalog')
            .subscribe((data: any) => {
                this.zones = data.zoneIdList || [];

                if (this.filter.zone) {
                    this.setBuildings(this.filter.zone);
                }
                if (this.filter.building) {
                    this.setUnits(this.filter.building);
                }
            }, (err: any) => {
                this.showErr();
                console.log(err);
            });
        this.http.get('/pm/aliyun/sampleUrl/customer')
            .subscribe((data: any) => {
                this.sampleUrl = data.fileUrl || [];
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
        if (this.filter.customerName) {
            params.customerName = this.filter.customerName;
        }
        if (this.filter.phone) {
            params.phone = this.filter.phone;
        }
        if (this.filter.plateNo) {
            params.plateNo = this.filter.plateNo;
        }

        this.http.get('/pm/customer', params).subscribe((data: any) => {
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

    setBuildings(zoneId: string) {
        for (let i = 0; i < this.zones.length; i++) {
            if (this.zones[i].zoneId === zoneId) {
                this.buildings = this.zones[i].buildingIdList;
                break;
            }
        }
    }

    setUnits(buildingId: string) {
        for (let i = 0; i < this.buildings.length; i++) {
            if (this.buildings[i].buildingId === buildingId) {
                this.units = this.buildings[i].unitIdList;
                break;
            }
        }
    }

    openDetail(data: Customer, isEdit: boolean) {
        this.curCustomer = new Customer();

        if (isEdit) {
            this.dialogStatus = 'edit';
            this.maskClosable = false;
            this.curCustomer = Object.assign({}, data);
        } else if (data.customerId) {
            this.dialogStatus = 'view';
            this.maskClosable = true;
            this.curCustomer = Object.assign({}, data);
        } else {
            this.dialogStatus = 'add';
            this.maskClosable = false;
        }

        this.valForm.reset(this.curCustomer);
        this.isVisible = true;
    }

    handleOk(e) {
        this.isConfirmLoading = true;

        if (this.dialogStatus === 'add') {
            this.http.post('/pm/customer', this.valForm.value)
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
            this.http.put('/pm/customer', Object.assign({}, this.valForm.value, {customerId: this.curCustomer.customerId}))
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

    deleteData(customer: Customer) {
        this.http.delete('/pm/customer', {customerId: customer.customerId})
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
