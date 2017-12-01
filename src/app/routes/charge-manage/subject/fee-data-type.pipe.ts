import { Pipe, PipeTransform } from '@angular/core';
import { feeDataTypeList } from './data-model';


@Pipe({ name: 'feeDataTypePipe' })
export class FeeDataTypePipe implements PipeTransform {
    transform(value: number): string {
        let label = '未知';

        if (value === -2) {
            label = '全部';
        }else {
            feeDataTypeList.forEach(e => {
                if (e.value === value ) {
                    label = e.label;
                }
            });
        }

        return label;
    }
}
