import { Pipe, PipeTransform } from '@angular/core';
import { cycleFlagList } from './data-model';


@Pipe({ name: 'cycleFlagPipe' })
export class CycleFlagPipe implements PipeTransform {
    transform(value: number): string {
        let label = '未知';

        if (value === -1) {
            label = '全部';
        }else {
            cycleFlagList.forEach(e => {
                if (e.value === value ) {
                    label = e.label;
                }
            });
        }

        return label;
    }
}
