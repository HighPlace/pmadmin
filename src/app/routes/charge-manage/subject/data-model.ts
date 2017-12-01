export const cycleFlagList = [{
    value: 0,
    label: '上周期'
}, {
    value: 1,
    label: '本周期'
}];

export const feeDataTypeList = [{
    value: -1,
    label: '收费车位'
}, {
    value: 0,
    label: '产权面积'
}, {
    value: 1,
    label: '水表'
}, {
    value: 2,
    label: '电表'
}, {
    value: 3,
    label: '燃气表'
}, {
    value: 4,
    label: '暖气表'
}, {
    value: 5,
    label: '空调表'
}, {
    value: 6,
    label: '服务工单'
}];

export const feeDataUnitList = [{
    value: '次',
    label: '次'
}, {
    value: '平方',
    label: '平方'
}, {
    value: '月',
    label: '月'
}, {
    value: '年',
    label: '年'
}, {
    value: '立方',
    label: '立方'
}, {
    value: '度',
    label: '度'
}];

export class Subject {
    subjectId = 0;
    subjectName = '';
    chargeCycle = 1;
    cycleFlag = 0;
    lateFee = 0.0;
    rate = 1;
    feeLevelOne = 0.0;
    levelOneToplimit = 0.0;
	feeLevelTwo = 0.0;
    levelTwoToplimit = 0.0;
	feeLevelThree = 0.0;
    levelThreeToplimit = 0.0;
	feeDataUnit= '';
	feeDataType = null;
    createTime = Date.now();
    modifyTime = Date.now();
    remark = '';
}
