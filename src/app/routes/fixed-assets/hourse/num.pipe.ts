import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'numFormat' })
export class NumFormatPipe implements PipeTransform {
    transform(value: number, precision: number = 1): string {
        let res = '未知';
        if (value > 0) {
            res = value.toFixed(precision);
        }
        return res;
    }
}
