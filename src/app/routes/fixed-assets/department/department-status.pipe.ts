import { Pipe, PipeTransform } from '@angular/core';
import { statusList } from './data-model';


@Pipe({ name: 'departmentStatus' })
export class StatusPipe implements PipeTransform {
    transform(value: number): string {
        let label = '未知';

        if (value === -1) {
            label = '全部';
        }else {
            statusList.forEach(e => {
                if (e.value === value ) {
                    label = e.label;
                }
            });
        }

        return label;
    }
}
