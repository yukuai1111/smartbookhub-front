import {get} from '@/utils/request'
import type{ UserInfo } from '@/interface/front'
export const getOtherUserInfo=(userId:string)=>{
    return get<{userId:string},UserInfo>(`/user/otherInfo`,{userId})
}