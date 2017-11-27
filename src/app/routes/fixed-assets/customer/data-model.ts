export const propertyStatusList = [{
    value: 0,
    label: '未知'
}, {
    value: 1,
    label: '未售'
}, {
    value: 2,
    label: '未装修'
}, {
    value: 3,
    label: '装修中'
}, {
    value: 4,
    label: '已入住'
}, {
    value: 5,
    label: '已出租'
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

export const relationTypeList = [{
    value: 0,
    label: '业主'
}, {
    value: 1,
    label: '租户'
}];

export const carTypeList = [{    //便于跟上面的type区分,前面加上car,实际字段是也type
    value: 0,
    label: '公共产权'
}, {
    value: 1,
    label: '自有产权'
}];

export const chargeStatusList = [{
    value: 0,
    label: '扣费'
}, {
    value: 1,
    label: '不扣费'
}];

export class Customer {   //关系: Customer包含Relation列表, Relation包含Car列表
    customerId = 0;
    customerName = '';
    identityType = 0;
    identityNo = '';
    phone = '';
    aliasName = '';
    email = '';
    wechat = '';
    lang = '';
	nation = '';
	gender = '';
	birth = '';
	identStartDate = '';
	identEndDate = '';
	identPic = '';
	backupPhone1 = '';
	backupPhone2 = '';
	emergencyContactName = '';
	emergencyContactPhone = '';
    createTime = Date.now();
    modifyTime = Date.now();
    remark = '';
}

export class Relation {
    relationId = 0;
	customerId = 0;
	propertyId = 0;
    propertyName = '';
    type = 0;
    status = 0;
    startDate = '';
    endDate = '';
    createTime = Date.now();
    modifyTime = Date.now();
    remark = '';
}

export class Car {
    relationId = 0;
	carId = 0;
    plateNo = '';
    type = 0;
    chargeStatus = 0;
    parkInfo = '';
    createTime = Date.now();
    modifyTime = Date.now();
    remark = '';
}
