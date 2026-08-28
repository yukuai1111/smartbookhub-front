//路由守卫
import { useUserStore } from '@/stores/userStore'
import { ElMessage } from 'element-plus'
import type { Router } from 'vue-router'
//白名单
const publicList=['/logReg','/','/articleSquare','/articleDetail','/about']  //不需要登陆的公开路由
const backList=['/articleDetail','/comment','/otherUserHome']  //后台放行的路由
export const routerGuard = (router: Router) => {
    router.beforeEach((to, from, next) => {
        const userStore = useUserStore()
        const token=userStore.token
        if (!token) {
            //未登录
            if (publicList.includes(to.path)) {
                //在白名单中，直接放行
                return next()
            }
            //不在白名单中，提示用户先登录
            ElMessage.warning('请先登录！')
            return next("/logReg?type=login")
        }
        //已登录
        //再次访问登陆注册
        if (to.path === '/logReg') {
            ElMessage.warning('已登录，无需重复登录！')
            return next(userStore.userinfo?.userType === 1 ? '/back/home' : '/')
        }
        //后台
        if (userStore.userinfo?.userType === 1) {
            if (to.path.startsWith('/back/') || backList.includes(to.path)) {
                if (!to.name) {
                    ElMessage.warning('页面不存在！')
                    return next('/back/home')
                }
                next()
            }
            else {
                next('/back/home')
            }
        } else {
            //普通用户
            //如果要访问后台界面
            if (to.path.startsWith('/back')) {
                ElMessage.warning('没有权限访问！')
                return next('/')
            }
            //如果访问的页面不存在
            if (!to.name) {
                ElMessage.warning('页面不存在！')
                return next('/')
            }
            next()
        }
    })
}