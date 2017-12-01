import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {NzMessageService, NzNotificationService, NzModalService} from 'ng-zorro-antd';
import {_HttpClient} from '@core/services/http.client';
import {SettingsService} from '@core/services/settings.service';
import {cycleFlagList, feeDataTypeList, feeDataUnitList, Subject} from './data-model';

@Component({
    selector: 'app-subject',
    templateUrl: './subject.component.html'
})
export class SubjectComponent implements OnInit {

    feeDataUnitList: any[] = [];
    feeDataTypeList: any[] = [];
    cycleFlagList: any[] = [];

    list: Subject[] = [];
    loading = false;
    total = 0;
    pageIndex = 1;
    pageSize = 10;
    sortField = 'subjectId';
    sortType = 'asc';
    sortMap = {
        subjectId   : null,
        feeLevelOne    : null,
        feeDataType : null
    };

    valForm: FormGroup;
    isVisible = false;
    isConfirmLoading = false;
    maskClosable = false;
    dialogStatus = 'view'; // edit add
    curSubejct = new Subject();

    constructor(private http: _HttpClient,
                private msg: NzMessageService,
                private setting: SettingsService,
                fb: FormBuilder) {

        this.feeDataTypeList = feeDataTypeList;
        this.feeDataUnitList = feeDataUnitList;
        this.cycleFlagList = cycleFlagList;

        this.valForm = fb.group({
            subjectName: [null, Validators.required],
            feeLevelOne: [null, Validators.required],
            feeDataUnit: [null, Validators.required],
            feeDataType: [null, null],
            chargeCycle: [null, null],
            cycleFlag: [null, null],
            lateFee: [null, null],
            rate: [null, null],
            levelOneToplimit: [null, null],
            feeLevelTwo: [null, null],
            levelTwoToplimit: [null, null],
            feeLevelThree: [null, null],
            levelThreeToplimit: [null, null]
        });

    }

    ngOnInit() {
        this.load();
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

        this.http.get('/pm/charge/subject', params).subscribe((data: any) => {
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

    openDetail(data: Subject, isEdit: boolean) {
        this.curSubejct = new Subject();

        if (isEdit) {
            this.dialogStatus = 'edit';
            this.maskClosable = false;
            this.curSubejct = Object.assign({}, data);
        } else if (data.subjectId) {
            this.dialogStatus = 'view';
            this.maskClosable = true;
            this.curSubejct = Object.assign({}, data);
        } else {
            this.dialogStatus = 'add';
            this.maskClosable = false;
        }

        this.valForm.reset(this.curSubejct);
        this.isVisible = true;
    }

    handleOk(e) {
        this.isConfirmLoading = true;

        if (this.dialogStatus === 'add') {
            this.http.post('/pm/charge/subject', this.valForm.value)
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
            this.http.put('/pm/charge/subject', Object.assign({}, this.valForm.value, {subjectId: this.curSubejct.subjectId}))
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

    deleteData(subject: Subject) {
        this.http.delete('/pm/charge/subject', {subjectId: subject.subjectId})
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
