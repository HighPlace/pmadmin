import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {NzMessageService, NzNotificationService, NzModalService} from 'ng-zorro-antd';
import {_HttpClient} from '@core/services/http.client';
import {SettingsService} from '@core/services/settings.service';
import {statusList, accountLockedList, Account, Role} from './data-model';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html'
})
export class AccountComponent implements OnInit {
    departments: any[] = [];
    positions: any[] = [];
    filterStatusList: any[] = [];
    statusList: any[] = [];
    roles: any[] = [];
    filter: any = {
        deptId: '',
        position: '',
        employeeName: '',
        phone: '',
        status: -1,
        username: ''
    };

    list: Account[] = [];
    loading = false;
    total = 0;
    pageIndex = 1;
    pageSize = 10;
    sortField = 'employeeId';
    sortType = 'asc';
    sortMap = {
        employeeId : 'ascend',
        username   : null
    };

    valForm: FormGroup;
    isVisible = false;
    isConfirmLoading = false;
    maskClosable = false;
    dialogStatus = 'view'; // edit add
    curAccount = new Account();

    constructor(private http: _HttpClient,
                private msg: NzMessageService,
                private setting: SettingsService,
                fb: FormBuilder) {
        this.filterStatusList = [{value: -1, label: '全部'}].concat(statusList);
        this.statusList = statusList;

        this.valForm = fb.group({
            employeeId: [null, Validators.required],
            username: [null, Validators.required],
            roleId: [null, Validators.required],
            password: [null, null]
        });

    }

    ngOnInit() {
        this.getFilter();
        this.load();
    }

    getFilter() {
        this.http.get('/pm/department/catalog')
            .subscribe((data: any) => {
                this.departments = data.data || [];
            }, (err: any) => {
                this.showErr();
                console.log(err);
            });
        this.http.get('/pm/employee/position?input=')
            .subscribe((data: any) => {
                this.positions = data.data || [];
            }, (err: any) => {
                this.showErr();
                console.log(err);
            });
        this.http.get('/uaa/roles')
            .subscribe((data: any) => {
                this.roles = data.data || [];
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

        if (this.filter.deptId) {
            params.deptId = this.filter.deptId;
        }
        if (this.filter.position) {
            params.position = this.filter.position;
        }
        if (this.filter.employeeName) {
            params.employeeName = this.filter.employeeName;
        }
        if (this.filter.phone) {
            params.phone = this.filter.phone;
        }
        if (this.filter.status >= 0) {
            params.status = this.filter.status;
        }
        if (this.filter.username) {
            params.username = this.filter.username;
        }

        this.http.get('/pm/account', params).subscribe((data: any) => {
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

    openDetail(data: Account, isEdit: boolean) {
        this.curAccount = new Account();

        if (isEdit) {
            this.dialogStatus = 'edit';
            this.maskClosable = false;
            this.curAccount = Object.assign({}, data);
        } else if (data.employeeId) {
            this.dialogStatus = 'view';
            this.maskClosable = true;
            this.curAccount = Object.assign({}, data);
        } else {
            this.dialogStatus = 'add';
            this.maskClosable = false;
        }

        this.valForm.reset(this.curAccount);
        this.isVisible = true;
    }

    handleOk(e) {
        this.isConfirmLoading = true;

        if (this.dialogStatus === 'add') {
            this.http.post('/pm/account', this.valForm.value)
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
            this.http.put('/pm/account', Object.assign({}, this.valForm.value, {username: this.curAccount.username}))
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
