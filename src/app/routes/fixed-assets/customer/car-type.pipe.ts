import { Pipe, PipeTransform } from '@angular/core';
import {carTypeList} from './data-model';


@Pipe({ name: 'carType' })
export class CarTypePipe implements PipeTransform {
    transform(value: number): string {
        let label = '未知';

        if (value === -1) {
            label = '全部';
        }else {
            carTypeList.forEach(e => {
                if (e.value === value ) {
                    label = e.label;
                }
            });
        }

        return label;
    }
}
