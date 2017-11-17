import {PipeTransform, Pipe} from '@angular/core';

const map = {
    'add': '新建',
    'edit': '编辑',
    'view': '查看',
};

@Pipe({name: 'dataOper'})
export class DataOperPipe implements PipeTransform {
    transform(value): string {
        return map[value] || '';
    }
}
