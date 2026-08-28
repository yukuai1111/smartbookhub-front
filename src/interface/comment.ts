export interface Comment {
    commentId: string,
    article_code: string,
    commentContent: string,
    commentUserId: string,
    commentCreateTime: number,
    reply_id: string | null,
    root_id: string | null,
    replyCount: number,
    commentName: string,
    commentAvatar: string,
    commentIsDeleted: boolean,
    targetName: string | null,
    targetUserId: string | null,
    targetIsDeleted: boolean,
    isExpandReply?: boolean,
    //是否本地临时数据
    // isLocal?: boolean,
    //是否强制展开
    // isForceExpandReply?: boolean,
}
export interface getCommentListRequest {
    articleCode: string,
    page?: number,
    pageSize?: number,
}
export interface getCommentListResponse {
    size: number,
    total: number,
    commentList: Comment[]
}
export interface getReplyListRequest {
    articleCode: string,
    rootId: string,
    page?: number,
}