//获取用户信息的基本信息
export interface baseUserInfo {
    userId: string,
    nickname: string,
    avatar: string,
    userType:number
}
//登陆注册的表单
export interface loginRegisterForm {
    account: string,
    password: string,
    username: string,
    phone: string,
    confirmPassword: string,
}

//登录请求体
export interface loginRequest {
    account: string,
    password: string,
}
//注册请求体
export interface registerRequest {
    username: string,
    phone: string,
    password: string,
    confirmPassword: string,
}

//登录的响应体
export interface loginResponse{
    token: string,
    userInfo: baseUserInfo,
}
//注册的响应体
export interface registerResponse{
   userId:string,
}