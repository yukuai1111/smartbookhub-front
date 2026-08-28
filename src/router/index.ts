import { createRouter, createWebHistory } from 'vue-router'
import { routerGuard } from './guard'
import { baseRoute, backRoute, frontRoute } from './routes'

//创建路由
const router = createRouter({
    history: createWebHistory(),   //工作模式
    //路由配置
    routes: [...baseRoute, ...backRoute, ...frontRoute]
})

//添加路由守卫
routerGuard(router)

export default router