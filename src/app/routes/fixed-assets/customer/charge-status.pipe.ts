import { Pipe, PipeTransform } from '@angular/core';
import {chargeStatusList} from './data-model';


@Pipe({ name: 'chargeStatus' })
export class ChargeStatusPipe implements PipeTransform {
    transform(value: number): string {
        let label = '未知';

        if (value === -1) {
            label = '全部';
        }else {
            chargeStatusList.forEach(e => {
                if (e.value === value ) {
                    label = e.label;
                }
            });
        }

        return label;
    }
}
