import { Pipe, PipeTransform } from '@angular/core';
import { identityTypeList} from './data-model';


@Pipe({ name: 'identityType' })
export class IdentityTypePipe implements PipeTransform {
    transform(value: number): string {
        let label = '未知';

        if (value === -1) {
            label = '全部';
        }else {
            identityTypeList.forEach(e => {
                if (e.value === value ) {
                    label = e.label;
                }
            });
        }

        return label;
    }
}
