export const statusList = [{
    value: 0,
    label: '在岗'
}, {
    value: 1,
    label: '不在岗'
}, {
    value: 2,
    label: '离职'
}];

export const accountLockedList = [{
    value: true,
    label: '有效'
}, {
    value: false,
    label: '无效'
}];

export class Account {
    employeeId = 0;
    deptName = '';
    employeeName = '';
    mobileNo = '';
    email = '';
    sysUsername = '';
    position = '';
    status = 0;
    accountLocked = false;
}

export class Role {
    roleId = 0;
    roleName = '';
}
