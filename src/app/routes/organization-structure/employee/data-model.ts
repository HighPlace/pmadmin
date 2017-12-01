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

export const identityTypeList = [{
    value: 0,
    label: '居民身份证'
}, {
    value: 1,
    label: '护照'
}, {
    value: 2,
    label: '港澳回乡证'
}, {
    value: 3,
    label: '台胞证'
}, {
    value: 4,
    label: '其他'
}];

export const genderList = [{
    value: '男',
    label: '男'
}, {
    value: '女',
    label: '女'
}, {
    value: '未知',
    label: '未知'
}];

export class Employee {
    employeeId = 0;
	deptId = 0;
    deptName = '';
    employeeName = '';
	phone = '';
	username = null;
	employeeCode = null;
	position = null;
	status = 0;
	aliasName = null;
    identityType = 0;
    identityNo = null;
    identPic = null;
    email = null;
    wechat = null;
	backupPhone1 = null;
	backupPhone2 = null;
	emergencyContactName = null;
	emergencyContactPhone = null;
	gender = null;
	entryDate = null;
	leaveDate = null;
    createTime = Date.now();
    modifyTime = Date.now();
    remark = '';
}
