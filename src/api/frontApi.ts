import {get,post,put,remove} from '@/utils/request'
import type{UserInfo,ChangeUserInfo,ChangePassword, Conversation,ConversationDetail} from '@/interface/front'
//获取用户信息
export const getUserInfo = async () => {
    return get<unknown,{userinfo:UserInfo}>('/front/userinfo')
}
//修改用户信息
export const updateUser = async (data:ChangeUserInfo,avatar?:File) => {
    const formData=new FormData()
    formData.append('nickname',data.nickname)
    formData.append('phone',data.phone)
    formData.append('signature',data.signature||'')
    if(avatar){
        formData.append('avatar',avatar)
    }
    return put<FormData,{userId:string,avatar:string,nickname:string}>('/front/changeUser',formData)
}
//修改密码
export const changePassword = async (data:ChangePassword) => {
    return put<ChangePassword,unknown>('/front/changePassword',data)
}
//注销用户
export const deleteUser = async () => {
    return post<unknown,unknown>('/front/remove')
}
//获取会话列表
export const getConversationList = async () => {
    return get<unknown,{conversationList:Conversation[],size:number}>('/front/ai/list')
}
//删除会话
export const deleteConversation = async (conversationId:string) => {
    return remove<unknown,{title:string}>('/front/ai/deleteConversation',{conversationId})
}
//获取会话详情
export const getConversationDetail = async (conversationId:string) => {
    return get<unknown,{messages:ConversationDetail[],size:number,title:string,session_id:string}>('/front/ai/detail',{conversationId})
}
//删除消息
export const deleteMessage = async (messageId:number) => {
    return remove<{messageId:number},unknown>('/front/ai/deleteMessage',{messageId})
}
