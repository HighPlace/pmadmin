import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {NzMessageService, NzNotificationService, NzModalService} from 'ng-zorro-antd';
import {_HttpClient} from '@core/services/http.client';
import {SettingsService} from '@core/services/settings.service';
import {statusList, propertyTypeList, areaUnitList, Hourse} from './data-model';

@Component({
    selector: 'app-hourse',
    templateUrl: './hourse.component.html'
})
export class HourseComponent implements OnInit {
    zones: any[] = [];
    buildings: any[] = [];
    units: string[] = [];
    filterStatusList: any[] = [];
    statusList: any[] = [];
    propertyTypeList: any[] = [];
    areaUnitList: any[] = [];
    sampleUrl = '';
    filter: any = {
        zone: '',
        building: '',
        unit: '',
        room: '',
        status: -1
    };
    zoneInput = '';

    list: Hourse[] = [];
    loading = false;
    total = 0;
    pageIndex = 1;
    pageSize = 10;

    valForm: FormGroup;
    isVisible = false;
    isConfirmLoading = false;
    maskClosable = false;
    dialogStatus = 'view'; // edit add
    curHourse = new Hourse();

    constructor(private http: _HttpClient,
                private msg: NzMessageService,
                private setting: SettingsService,
                fb: FormBuilder) {
        this.filterStatusList = [{value: -1, label: '全部'}].concat(statusList);
        this.statusList = statusList;
        this.propertyTypeList = propertyTypeList;
        this.areaUnitList = areaUnitList;

        this.valForm = fb.group({
            zoneId: [null, null],
            buildingId: [null, Validators.required],
            unitId: [null, null],
            roomId: [null, Validators.required],
            houseType: [null, null],
            propertyType: [0, Validators.required],
            propertyArea: [null, Validators.required],
            floorArea: [null, null],
            areaUnit: [0, Validators.required],
            status: [0, Validators.required]
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
        this.http.get('/pm/aliyun/sampleUrl/property')
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
            sortField: 'zoneId',
            sortType: 'asc'
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

    openDetail(data: Hourse, isEdit: boolean) {
        this.curHourse = new Hourse();

        if (isEdit) {
            this.dialogStatus = 'edit';
            this.maskClosable = false;
            this.curHourse = Object.assign({}, data);
        } else if (data.propertyId) {
            this.dialogStatus = 'view';
            this.maskClosable = true;
            this.curHourse = Object.assign({}, data);
        } else {
            this.dialogStatus = 'add';
            this.maskClosable = false;
        }

        this.valForm.reset(this.curHourse);
        this.isVisible = true;
    }

    handleOk(e) {
        this.isConfirmLoading = true;

        if (this.dialogStatus === 'add') {
            this.http.post('/pm/property', this.valForm.value)
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
            this.http.put('/pm/property', Object.assign({}, this.valForm.value, {propertyId: this.curHourse.propertyId}))
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

    deleteData(hourse: Hourse) {
        this.http.delete('/pm/property', {propertyId: hourse.propertyId})
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
