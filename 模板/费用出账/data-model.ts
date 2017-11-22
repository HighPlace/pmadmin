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

export class Bill {    //账单类别
    billId = 0;
    billName = '';
    billCycle = 0;
    lastPayDay = 0;
    createTime = Date.now();
    modifyTime = Date.now();
    remark = '';
}

export class Charge {    //出账单
    chargeId = 0;
	billId = 0;
    billName = '';
    billPeriod = '';
    status = 0;
    totalAmount = 0;
    receivedAmount = 0;
    createTime = Date.now();
    modifyTime = Date.now();
    remark = '';
}
