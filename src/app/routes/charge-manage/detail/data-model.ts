export const statusList = [{
    value: 0,
    label: '出账中'
}, {
    value: 1,
    label: '仪表数据导入完成'
}, {
    value: 2,
    label: '出账完成'
}, {
    value: 3,
    label: '收费中'
}, {
    value: 4,
    label: '收费完成'
}];

export const payStatusList = [{
    value: 0,
    label: '收费中'
}, {
    value: 1,
    label: '欠费'
}, {
    value: 2,
    label: '已缴费'
}];

export const payTypeList = [{
    value: 0,
    label: '银行托收'
}, {
    value: 1,
    label: '微信缴费'
}];

export class Detail {
    detailId = 0;
    chargeId = 0;
	billId = 0;
	billName = '';
	propertyId = 0;
	propertyName = '';
	payStatus = 0;
	payType = 0;
	payId = '';
	amount = 0.0;
    createTime = Date.now();
    modifyTime = Date.now();
    remark = '';
}

export class DetailItem {
    detailId = 0;
    chargeId = 0;
    billId = 0;
    billName = '';
    propertyId = 0;
    propertyName = '';
    payStatus = 0;
    payType = 0;
    payId = '';
    amount = 0.0;
    createTime = Date.now();
    modifyTime = Date.now();
    remark = '';
}

