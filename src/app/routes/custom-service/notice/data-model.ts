export const statusList = [{
    value: 0,
    label: '已创建'
}, {
    value: 1,
    label: '已发布'
}];

export class Notice {
    noticeId = 0;
    title = '';
    type = '';
    status = 0;
    content = '';
    publishDate = Date.now();
    validDate = null;
    publisher = '';
    approver = '';
    attachmentName = '';
    attachmentLink = '';
    createTime = Date.now();
    modifyTime = Date.now();
    remark = '';
}
