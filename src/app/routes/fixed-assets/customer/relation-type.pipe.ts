import { Pipe, PipeTransform } from '@angular/core';
import {relationTypeList} from './data-model';


@Pipe({ name: 'relationType' })
export class RelationTypePipe implements PipeTransform {
    transform(value: number): string {
        let label = '未知';

        if (value === -1) {
            label = '全部';
        }else {
            relationTypeList.forEach(e => {
                if (e.value === value ) {
                    label = e.label;
                }
            });
        }

        return label;
    }
}
