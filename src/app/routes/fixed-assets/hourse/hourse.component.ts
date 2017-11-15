import { Component, OnInit } from '@angular/core';
import {_HttpClient} from '@core/services/http.client';

@Component({
    selector: 'app-hourse',
    templateUrl: './hourse.component.html'
})
export class HourseComponent implements OnInit {
    options: Object = {};
    filter: Object = {
        zone: '',
        building: '',
        unit: '',
        room: '',
        status: ''
    };

    constructor(private http: _HttpClient) {
    }

    ngOnInit() {
        this.getFilter();
    }

    getFilter() {
        this.http.get('/pm/property/catalog')
            .subscribe((data: any) => {
            console.log(data);
        }, (err: any) => {
            console.log(err);
        });
    }
}
