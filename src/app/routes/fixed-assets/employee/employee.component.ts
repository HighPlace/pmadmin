import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {NzMessageService, NzNotificationService, NzModalService} from 'ng-zorro-antd';
import {_HttpClient} from '@core/services/http.client';
import {SettingsService} from '@core/services/settings.service';
import {statusList, identityTypeList, genderList, Employee} from './data-model';

@Component({
    selector: 'app-employee',
    templateUrl: './employee.component.html'
})
export class EmployeeComponent implements OnInit {
    departments: any[] = [];
    positions: any[] = [];
    filterStatusList: any[] = [];
    statusList: any[] = [];
    identityTypeList: any[] = [];
    genderList: any[] = [];
    filter: any = {
        deptId: '',
        position: '',
        employeeName: '',
        phone: '',
        status: -1
    };

    list: Employee[] = [];
    loading = false;
    total = 0;
    pageIndex = 1;
    pageSize = 10;

    valForm: FormGroup;
    isVisible = false;
    isConfirmLoading = false;
    maskClosable = false;
    dialogStatus = 'view'; // edit add
    curEmployee = new Employee();

    constructor(private http: _HttpClient,
                private msg: NzMessageService,
                private setting: SettingsService,
                fb: FormBuilder) {
        this.filterStatusList = [{value: -1, label: '全部'}].concat(statusList);
        this.statusList = statusList;
        this.identityTypeList = identityTypeList;
        this.genderList = genderList;

        this.valForm = fb.group({
            deptId: [null, Validators.required],
            employeeName: [null, Validators.required],
            phone: [null, Validators.required],
            employeeCode: [null, null],
            position: [null, null],
            status: [0, null],
            aliasName: [null, null],
            identityType: [0, null],
            identityNo: [null, null],
            identPic: [null, null],
            email: [null, null],
            wechat: [null, null],
            backupPhone1: [null, null],
            backupPhone2: [null, null],
            emergencyContactName: [null, null],
            emergencyContactPhone: [null, null],
            gender: [null, null],
            entryDate: [null, null],
            leaveDate: [null, null]
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
    }

    load(reset?: boolean) {
        if (reset) {
            this.pageIndex = 1;
        }
        this.loading = true;

        const params: any = {
            pageNum: this.pageIndex,
            pageSize: this.pageSize,
            sortField: 'employeeId',
            sortType: 'asc'
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

        this.http.get('/pm/employee', params).subscribe((data: any) => {
            this.loading = false;
            this.total = data.totalCount || 0;
            this.list = data.data || [];
        }, (err: any) => {
            this.showErr();
            console.log(err);
        });
    }

    openDetail(data: Employee, isEdit: boolean) {
        this.curEmployee = new Employee();

        if (isEdit) {
            this.dialogStatus = 'edit';
            this.maskClosable = false;
            this.curEmployee = Object.assign({}, data);
        } else if (data.employeeId) {
            this.dialogStatus = 'view';
            this.maskClosable = true;
            this.curEmployee = Object.assign({}, data);
        } else {
            this.dialogStatus = 'add';
            this.maskClosable = false;
        }

        this.valForm.reset(this.curEmployee);
        this.isVisible = true;
    }

    handleOk(e) {
        this.isConfirmLoading = true;

        if (this.dialogStatus === 'add') {
            this.http.post('/pm/employee', this.valForm.value)
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
            this.http.put('/pm/employee', Object.assign({}, this.valForm.value, {employeeId: this.curEmployee.employeeId}))
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

    deleteData(employee: Employee) {
        this.http.delete('/pm/employee', {employeeId: employee.employeeId})
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
