import {Component, OnInit} from '@angular/core';
import {_HttpClient} from '@core/services/http.client';
import { statusList } from './model';

@Component({
    selector: 'app-hourse',
    templateUrl: './hourse.component.html'
})
export class HourseComponent implements OnInit {
    zones: any[] = [];
    buildings: any[] = [];
    units: string[] = [];
    roomStatusList: any[] = statusList;
    filter: any = {
        zone: '',
        building: '',
        unit: '',
        room: '',
        status: -1
    };

    list = [];
    loading = false;
    total = 0;
    pageIndex = 1;
    pageSize = 10;

    constructor(private http: _HttpClient) {
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

        let params:any = {
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

    openDetail(data, isEdit: boolean) {

    }
}
