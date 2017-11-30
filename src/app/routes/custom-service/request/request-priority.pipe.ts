import { Pipe, PipeTransform } from '@angular/core';
import { priorityList } from './data-model';


@Pipe({ name: 'requestPriority' })
export class RequestPriorityPipe implements PipeTransform {
    transform(value: number): string {
        let label = '未知';

        if (value === -1) {
            label = '全部';
        }else {
            priorityList.forEach(e => {
                if (e.value === value ) {
                    label = e.label;
                }
            });
        }

        return label;
    }
}
