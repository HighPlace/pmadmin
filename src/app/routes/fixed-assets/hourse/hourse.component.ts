import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {_HttpClient} from '@core/services/http.client';
import { SettingsService } from '@core/services/settings.service';
import { statusList, propertyTypeList, areaUnitList, Hourse } from './data-model';

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
    filter: any = {
        zone: '',
        building: '',
        unit: '',
        room: '',
        status: -1
    };

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

    constructor(private http: _HttpClient,
                private setting: SettingsService,
                fb: FormBuilder) {
        this.filterStatusList = statusList;
        this.filterStatusList.push({
            value: -1,
            label: '全部'
        });
        this.statusList = statusList;
        this.propertyTypeList = propertyTypeList;
        this.areaUnitList = areaUnitList;

        this.valForm = fb.group({
            zoneId: [null, null],
            buildingId: [null, Validators.required],
            unitId: [null, Validators.required],
            roomId: [null, Validators.required],
            houseType: [null, null],
            propertyType: [0, Validators.required],
            propertyArea: [null, null],
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
            }, (err: any) => {
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
            pageSize: this.pageSize
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
        let _data: Hourse = new Hourse();

        if (isEdit) {
            this.dialogStatus = 'edit';
            this.maskClosable = false;
            _data = Object.assign({}, data);
        }else if (data.propertyId) {
            this.dialogStatus = 'view';
            this.maskClosable = true;
        }else {
            this.dialogStatus = 'add';
            this.maskClosable = false;
            _data = Object.assign({}, data);
        }

        this.valForm.reset(_data);
        this.isVisible = true;
    }

    handleOk(e) {
        this.isVisible = false;
    }

    handleCancel(e) {
        this.isVisible = false;
    }

    getFormControl(name) {
        return this.valForm.controls[name];
    }
}
