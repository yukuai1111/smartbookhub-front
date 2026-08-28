<template>
    <div class="aside-page">
        <el-menu :default-active="activeMenus" :default-openeds="openMenus">
            <!-- 数据分析 -->
            <el-menu-item index="/home" @click="handleRouter('backHome')">
                <el-icon>
                    <PieChart />
                </el-icon>
                <span>数据分析</span>
            </el-menu-item>
            <!-- 我的文章 -->
            <el-sub-menu index="/myArticle">
                <template #title>
                    <el-icon>
                        <Document />
                    </el-icon>
                    <span>我的文章</span>
                </template>
                <el-menu-item v-for="iten in myArticle" :index="iten.index"
                    @click="handleRouter(iten.router, iten.type, true)">
                    <template #title>{{ iten.title }}</template>
                </el-menu-item>
            </el-sub-menu>
            <!-- 文章管理 -->
            <el-sub-menu index="/articleManager">
                <template #title>
                    <el-icon>
                        <Setting />
                    </el-icon>
                    <span>文章管理</span>
                </template>
                <el-menu-item v-for="iten in articleManager" :index="iten.index"
                    @click="handleRouter(iten.router, iten.type, false)">
                    <template #title>{{ iten.title }}</template>
                </el-menu-item>
            </el-sub-menu>
        </el-menu>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PieChart, Document, Setting } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { getMenuOpen, getActiveMenu } from '@/utils/menuHelper'
import type { Menu } from '@/interface/api'
const router = useRouter()
const route = useRoute()
const handleRouter = (key: string, type?: string, onlySelf?: boolean) => {
    router.push({
        name: key,
        query: {
            type,
            onlySelf: onlySelf?.toString()
        }
    })
}
//我的文章列表
const myArticle:Menu[] = [
    {
        index: '/back/myArticle/all',
        router: 'backMyArticle',
        type: 'all',
        title: '全部',
    },
    {
        index: '/back/myArticle/draft',
        router: 'backMyArticle',
        type: 'draft',
        title: '草稿',
    },
    {
        index: '/back/myArticle/published',
        router: 'backMyArticle',
        type: 'published',
        title: '已发布',
    },
    {
        index: '/back/myArticle/offline',
        router: 'backMyArticle',
        type: 'offline',
        title: '已下线',
    }
]
//文章管理列表
const articleManager:Menu[] = [
    {
        index: '/back/articleManager/all',
        router: 'backArticleManager',
        type: 'all',
        title: '全部',
    },
    {
        index: '/back/articleManager/pending',
        router: 'backArticleManager',
        type: 'pending',
        title: '待审核',
    },
    {
        index: '/back/articleManager/published',
        router: 'backArticleManager',
        type: 'published',
        title: '已发布',
    },
    {
        index: '/back/articleManager/offline',
        router: 'backArticleManager',
        type: 'offline',
        title: '已下线',
    },
    {
        index: '/back/articleManager/rejected',
        router: 'backArticleManager',
        type: 'rejected',
        title: '已驳回',
    },
]

//展开的菜单
const openMenus = computed(() => {
   const list: string[] = []
   // 匹配【我的文章】下面所有子路由，前缀匹配
   getMenuOpen(router.currentRoute.value.path, '/back/myArticle', '/myArticle', list)
   // 匹配【文章管理】下面所有子路由，前缀匹配
   getMenuOpen(router.currentRoute.value.path, '/back/articleManager', '/articleManager', list)
   return list
 })
 //高亮的菜单
const activeMenus = computed(() => {
   const queryType=route.query.type as string
   if(router.currentRoute.value.path.startsWith('/back/myArticle')){
    //在myArticle里找到type和queryType一样的
    return getActiveMenu(queryType, '/myArticle', myArticle)
   }
    if(router.currentRoute.value.path.startsWith('/back/articleManager')){
    //在articleManager里找到type和queryType一样的
    return getActiveMenu(queryType, '/articleManager', articleManager)
   }
   return '/home'
})
</script>

<style scoped lang="scss">
.aside-page {
    height: 100vh;
    background-color: #f5f7fa;
}
</style>