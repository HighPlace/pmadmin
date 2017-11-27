import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {NzMessageService, NzNotificationService, NzModalService} from 'ng-zorro-antd';
import {_HttpClient} from '@core/services/http.client';
import {SettingsService} from '@core/services/settings.service';
import {statusList, Department} from './data-model';

@Component({
    selector: 'app-department',
    templateUrl: './department.component.html'
})
export class DepartmentComponent implements OnInit {
    departments: any[] = [];
    filter: any = {
        superiorDeptId: ''
    };

    list: Department[] = [];
    loading = false;
    total = 0;
    pageIndex = 1;
    pageSize = 10;
    sortField = 'deptId';
    sortType = 'asc';
    sortMap = {
        deptId   : null,
        level    : null,
        deptCode : null
    };

    valForm: FormGroup;
    isVisible = false;
    isConfirmLoading = false;
    maskClosable = false;
    dialogStatus = 'view'; // edit add
    curDepartment = new Department();

    constructor(private http: _HttpClient,
                private msg: NzMessageService,
                private setting: SettingsService,
                fb: FormBuilder) {

        this.valForm = fb.group({
            deptName: [null, Validators.required],
            superiorDeptId: [null, null],
            deptCode: [null, null],
            aliasName: [null, null],
            deptDesc: [null, null]
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

        if (this.filter.superiorDeptId) {
            params.superiorDeptId = this.filter.superiorDeptId;
        }

        this.http.get('/pm/department', params).subscribe((data: any) => {
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

    openDetail(data: Department, isEdit: boolean) {
        this.curDepartment = new Department();

        if (isEdit) {
            this.dialogStatus = 'edit';
            this.maskClosable = false;
            this.curDepartment = Object.assign({}, data);
        } else if (data.deptId) {
            this.dialogStatus = 'view';
            this.maskClosable = true;
            this.curDepartment = Object.assign({}, data);
        } else {
            this.dialogStatus = 'add';
            this.maskClosable = false;
        }

        this.valForm.reset(this.curDepartment);
        this.isVisible = true;
    }

    handleOk(e) {
        this.isConfirmLoading = true;

        if (this.dialogStatus === 'add') {
            this.http.post('/pm/department', this.valForm.value)
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
            this.http.put('/pm/department', Object.assign({}, this.valForm.value, {deptId: this.curDepartment.deptId}))
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

    deleteData(department: Department) {
        this.http.delete('/pm/department', {deptId: department.deptId})
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
