export const statusList = [{
    value: 0,
    label: '未发布'
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
    publishDate = null;
    validDate = null;
    publisher = '';
    approver = '';
    attachmentName = '';
    attachmentLink = '';
    remark = '';
}
