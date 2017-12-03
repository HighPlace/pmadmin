import {Pipe, PipeTransform} from '@angular/core';
import {accountLockedList} from './data-model';

@Pipe({name: 'accountStatusPipe'})
export class AccountStatusPipe implements PipeTransform {
    transform(value: boolean): string {
        let label = '';
        accountLockedList.forEach(e => {
            if (e.value === value) {
                label = e.label;
            }
        });
        return label;
    }
}
