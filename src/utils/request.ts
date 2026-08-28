import axios from 'axios'
import type { Response } from '@/interface/api'
import { useUserStore } from '@/stores/userStore'
import router from '@/router'
import { ElMessage } from 'element-plus'
import type { OnChunk, OnCompleted, OnError } from '@/interface/api'
import type { AIRequest } from '@/interface/front'

const baseURL = import.meta.env.VITE_API_BASEURL
let isLogout = false
//创建axios实例
export const server = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})

//封装请求拦截器
server.interceptors.request.use(
    config => {
        //装token等等的公共操作
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = 'Bearer ' + token
        }
        // 处理formData类型的数据
        if (config.data instanceof FormData) {
            config.headers['Content-Type'] = 'multipart/form-data'
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)
//封装响应拦截器
server.interceptors.response.use(
    async res => {
        //200是成功
        if (res && res.data.status === 200) {
            return res
        }
        //401是token出错，重新登陆
        if (res && res.data.status === 401) {
            if (isLogout) return new Promise(() => { })
            isLogout = true
            const userStore = useUserStore()
            //清空用户信息
            userStore.clearUserInfo()
            //跳转登录页
            await router.push({ name: 'logReg', query: { type: 'login' } }).catch((err) => {
                console.log('跳转登录页失败', err)
            })
            //提示用户重新登录
            ElMessage.error(res.data.message)
            //打开锁
            setTimeout(() => {
                isLogout = false
            }, 3000)
            return new Promise(() => { })
        }
        return Promise.reject(res.data.message)
    },
    error => {
        console.log("响应错误", error)
        return Promise.reject(error)
    }
)

//封装post
export const post = async<R, T>(url: string, data?: R) => {   //R是请求体data的类型，T是响应体data的类型
    const res = await server.post<Response<T>>(url, data)
    return res.data
}

//封装get
export const get = async<R, T>(url: string, params?: R) => {
    const res = await server.get<Response<T>>(url, { params })
    return res.data
}

//封装delete
export const remove = async<R, T>(url: string, data?: R) => {
    const res = await server.delete<Response<T>>(url, { data })
    return res.data
}
//封装put
export const put = async<R, T>(url: string, data?: R) => {
    const res = await server.put<Response<T>>(url, data)
    return res.data
}


//流式请求
export const streamPost = async (
    url: string,
    message: AIRequest,
    onChunk: OnChunk,
    onCompleted: OnCompleted,
    onError: OnError,
    controller: AbortController) => {
    try {
        const userStore = useUserStore()
        const res = await fetch(`${baseURL}${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userStore.token
            },
            body: JSON.stringify(message),
            signal: controller.signal,  // 直接使用外部传入的 controller，外部 abort 时立即中断
        })
        const contentType = res.headers.get('Content-Type')
        if (contentType && contentType.includes('application/json')) {
            if (isLogout) return
            //返回的是json数据，证明token有误
            const data = await res.json() //拿到后端返回的原始数据
            if (data.status === 401) {
                isLogout = true
                userStore.clearUserInfo()
                await router.push({
                    name: 'logReg',
                    query: {
                        type: 'login'
                    }
                }).catch((err) => {
                    console.log('跳转登录页失败', err)
                })
                ElMessage.error(data.message)
                setTimeout(() => {
                    isLogout = false
                }, 3000)
                return
            } else {
                onError(data.message || '请求失败')
                ElMessage.error(data.message || '请求失败')
                return
            }
        }
        if (!res.body) throw new Error('响应体流式数据为空');
        //读取流
        const reader = res.body.getReader()
        //把流数据（二进制）转成字符串结构
        const decoder = new TextDecoder()
        let buffer = ''
        while (true) {
            const { done, value } = await reader.read()
            if (done) break
            const chunk = decoder.decode(value, { stream: true })
            buffer += chunk
            const lines = buffer.split('\n')
            buffer = lines.pop() || ''
            lines.forEach(line => {
                const lineTrim = line.trim()
                if (!lineTrim || !lineTrim.startsWith('data:')) return
                try {
                    const data = JSON.parse(lineTrim.slice(5))
                    if (!data) return
                    //正常输出
                    if (data.type === 'onchunk' && data.content) {
                        //如果content是对象，证明要回去替换临时数据
                        if (typeof data.content === 'object' && data.content.type === 'conv_id') {
                            const raw = data.content
                            //传回去替换临时id
                            onChunk({
                                type: raw.type,
                                session_id: raw.session_id,
                                message_id: raw.user_msg.message_id,
                                ai_msgId: raw.ai_msgId
                            })
                        }
                        else if (typeof data.content === 'string') {
                            //就是ai回复的消息
                            onChunk({
                                type: data.type,
                                content: data.content
                            })
                        }
                    }
                    //请求完成
                    if (data.type === 'complete') {
                        onCompleted()
                    }
                    //请求失败
                    if (data.type === 'error') {
                        onError(data.msg || 'AI请求失误')
                    }
                } catch (err: unknown) {
                    console.log("流式解析错误", err)
                }
            })
        }

    } catch (err) {
        // 主动取消时不报错
        if (err instanceof DOMException && err.name === 'AbortError') {
            return
        }
        if (err instanceof Error) {
            onError(err.message)
        } else {
            onError('流式请求中出现未知错误')
        }
    }
}