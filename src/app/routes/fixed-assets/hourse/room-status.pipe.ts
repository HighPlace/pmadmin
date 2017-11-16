import { Pipe, PipeTransform } from '@angular/core';
import { statusList } from './model';


@Pipe({ name: 'roomStatus' })
export class RoomStatusPipe implements PipeTransform {
    transform(value: number): string {
        let label = '未知';
        statusList.forEach(e => {
            if (e.value === value ) {
                label = e.label;
            }
        });
        return label;
    }
}
