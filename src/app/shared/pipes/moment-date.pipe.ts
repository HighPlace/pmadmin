import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

/**
 * 基于 moment 日期格式化，显示更多细节参考：
 *
 * @see http://momentjs.com/docs/#/displaying
 *
 * @example
 * ```html
 * {{ data | _data }}
 * 2017-09-17 15:35
 *
 * {{ data | _data: 'YYYY年MM月DD日' }}
 * 2017年09月17
 * ```
 */
@Pipe({ name: '_date' })
export class MomentDatePipe implements PipeTransform {
    transform(value: Date, formatString: string = 'YYYY-MM-DD HH:mm:ss'): string {
        if (value) {
            return moment(value).format(formatString);
        } else {
            return '无';
        }
    }
}
