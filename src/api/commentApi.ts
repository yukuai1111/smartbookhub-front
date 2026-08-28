import {get,post} from '@/utils/request'
import type {getCommentListRequest,getCommentListResponse,getReplyListRequest} from '@/interface/comment'

//获取一级评论
export const getCommentList=async (data:getCommentListRequest)=>{
    return get<getCommentListRequest,getCommentListResponse>('/comment/list',data)
}
//获取二级评论
export const getReplyList=async (data:getReplyListRequest)=>{
    return get<getReplyListRequest,getCommentListResponse>('/comment/reply',data)
}
//删除评论
export const deleteComment=async (articleCode:string,commentId:string)=>{
    return post<{articleCode:string,commentId:string}, unknown>('/comment/remove',{articleCode,commentId})
}
//发送评论
export const sendComment=async (articleCode:string,content:string,replyId?:string)=>{
    return post<{articleCode:string,content:string,replyId?:string}, {commentId:string,replyId:string,rootId:string}>('/comment/add',{articleCode,content,replyId})
}