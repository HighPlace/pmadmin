export const sourceList = [{
    value: 0,
    label: '未知'
}, {
    value: 1,
    label: '客服电话'
}, {
    value: 2,
    label: '公众号'
}, {
    value: 3,
    label: '客户上门'
}, {
    value: 4,
    label: '内部'
}];

export const statusList = [{
    value: 0,
    label: '待指派'
}, {
    value: 1,
    label: '待处理'
}, {
    value: 2,
    label: '处理中'
}, {
    value: 3,
    label: '处理完成'
}, {
    value: 4,
    label: '评价完成'
}];

export const priorityList = [{
    value: 1,
    label: '低'
}, {
    value: 2,
    label: '较低'
}, {
    value: 3,
    label: '中'
}, {
    value: 4,
    label: '较高'
}, {
    value: 5,
    label: '高'
}];

export const rateLevelList = [{
    value: 1,
    label: '非常不满意'
}, {
    value: 2,
    label: '不满意'
}, {
    value: 3,
    label: '中'
}, {
    value: 4,
    label: '满意'
}, {
    value: 5,
    label: '非常满意'
}];

export class Request {
    requestId = 0;
    type = '';
    subType = '';
    source = 0;
	status = 0;
    content = '';
    attachment1 = '';
    attachment2 = '';
	propertyId = 0;
	submitter = '';
	contactInfo = '';
	priority = 3;
	startTime = '';
	assignTime = '';
	acceptTime = '';
	finishTime = '';
	rateTime = '';
	dealEmployeeId = 0;
	dealDesc = '';
	dealFee = 0;
	dealAttachment = '';
	rateLevel = 3;
	rateNum = 0;
	rateDesc = '';
	rateAttachment	= '';
	rateUsername = '';
    remark = '';
}
