export const statusList = [{
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

export const propertyTypeList = [{
    value: 0,
    label: '住宅'
}, {
    value: 1,
    label: '商业'
}];

export const areaUnitList = [{
    value: 0,
    label: '平方米'
}];

export class Hourse {
    propertyId = 0;
    productInstId = '';
    propertyType = 0;
    zoneId = '';
    buildingId = '';
    unitId = '';
    roomId = '';
    areaUnit = 0;
    propertyArea = 0;
    floorArea = 0;
    houseType = '';
    status = 0;
    createTime = Date.now();
    modifyTime = Date.now();
    remark = '';
}
