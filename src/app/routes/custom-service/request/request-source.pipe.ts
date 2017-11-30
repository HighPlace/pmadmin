import { Pipe, PipeTransform } from '@angular/core';
import { sourceList } from './data-model';


@Pipe({ name: 'requestSource' })
export class RequestSourcePipe implements PipeTransform {
    transform(value: number): string {
        let label = '未知';

        if (value === -1) {
            label = '全部';
        }else {
            sourceList.forEach(e => {
                if (e.value === value ) {
                    label = e.label;
                }
            });
        }

        return label;
    }
}
