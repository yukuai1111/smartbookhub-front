//存放用户信息
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { baseUserInfo } from '@/interface/user'
export const useUserStore = defineStore('user', () => {
    //定义用户信息
    const userinfo = ref<baseUserInfo | null>(null)
    //定义token
    const token = ref<string>('')
    //定义登陆状态
    const isLogin = computed(() => {
        return !!token.value
    })

    //设置用户信息
    const setUserInfo = (info: baseUserInfo, newToken: string) => {
        userinfo.value = info
        token.value = newToken
        //本地存储
        localStorage.setItem('userinfo', JSON.stringify(info))
        localStorage.setItem('token', newToken)
    }
    //清除用户信息
    const clearUserInfo = () => {
        userinfo.value = null
        token.value = ''
        //本地存储
        localStorage.removeItem('userinfo')
        localStorage.removeItem('token')
    }
    //更新用户信息
    const updateUserInfo = (info: baseUserInfo) => {
        userinfo.value = info
        //本地存储
        localStorage.setItem('userinfo', JSON.stringify(info))
    }
    //初始化用户信息
    const initUserInfo = () => {
        const userinfoStr = localStorage.getItem('userinfo')
        if (userinfoStr) {
            userinfo.value = JSON.parse(userinfoStr)
        }
        token.value = localStorage.getItem('token') || ''
    }
    initUserInfo()
    return {
        userinfo,
        token,
        isLogin,
        setUserInfo,
        clearUserInfo,
        updateUserInfo,
    }
})