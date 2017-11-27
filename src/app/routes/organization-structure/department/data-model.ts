export const statusList = [{
    value: 0,
    label: '有效'
}, {
    value: 1,
    label: '失效'
}];

export class Department {
    deptId = 0;
    deptName = '';
    level = 0;
    status = 0;
    superiorDeptId = null;
    deptCode = '';
    aliasName = '';
    deptDesc = '';
    createTime = Date.now();
    modifyTime = Date.now();
    remark = '';
}
