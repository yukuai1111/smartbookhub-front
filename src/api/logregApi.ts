import type { registerRequest,loginRequest,loginResponse,registerResponse } from '@/interface/user'
import {post} from '@/utils/request'
//注册接口
export const register=async (data:registerRequest)=>{
    return post<registerRequest,registerResponse>('/logreg/register',data)
}
//登录接口
export const login=async (data:loginRequest)=>{
    return post<loginRequest,loginResponse>('/logreg/login',data)
}