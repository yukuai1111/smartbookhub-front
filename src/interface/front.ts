export interface UserInfo {
    id: number,
    avatar: string,
    username: string,
    nickname: string,
    signature: string | null,
    phone: string,
    create_time: number
}

//修改用户信息请求体
export interface ChangeUserInfo {
    nickname: string,
    signature: string | null,
    phone: string,
}
//修改密码请求体
export interface ChangePassword {
    oldPassword: string,
    newPassword: string,
    confirmPassword: string,
}

//会话列表
export interface Conversation {
    id: string,
    title: string,
    start_time: number,
    end_time: number
}
//会话详情
export interface ConversationDetail {
    message_id: number,
    role:'user'|'assistant',
    message: string,
    send_time: number
}
//用户临时会话详情
export interface TempConversationDetail {
    temp_id: string,
    role:'user',
    message: string,
    send_time: number,
    isTemp:boolean,
    message_id:null|number
}
//ai占位符
export interface AiPlaceholder {
    temp_id: string,
    role:'assistant',
    message: string,
    send_time: number,
    isTemp:boolean,
    loading:boolean,
    message_id:null|number,
    status:1|2|3
}
//获取ai消息的请求体
export interface AIRequest {
    message: string,
    conversationId?: string,
}
