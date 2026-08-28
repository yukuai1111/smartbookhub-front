<template>
    <div class="aside-page">
        <el-menu :default-active="activeMenu" :default-openeds="openMenu">
            <div class="info" v-if="userStore.userinfo">
                <el-image class="avatar" :src="avatarBaseurl + userStore.userinfo.avatar" fit="cover" />
                <div class="nickname">{{ userStore.userinfo?.nickname }}</div>
            </div>
            <!-- 个人信息 -->
            <el-menu-item index="/profile/info" @click="handleRouter('profileInfo')">
                <el-icon>
                    <Setting />
                </el-icon>
                <span>个人信息</span>
            </el-menu-item>
            <!-- 我的文章 -->
            <el-sub-menu index="/profile/article">
                <template #title>
                    <el-icon>
                        <Document />
                    </el-icon>
                    <span>我的文章</span>
                </template>
                <el-menu-item v-for="iten in myArticle" :index="iten.index"
                    @click="handleRouter(iten.router, iten.type)">
                    <template #title>{{ iten.title }}</template>
                </el-menu-item>
            </el-sub-menu>
        </el-menu>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getActiveMenu, getMenuOpen } from '@/utils/menuHelper'
import { Setting, Document } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/userStore'
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const avatarBaseurl = import.meta.env.VITE_IMG_BASEURL
const handleRouter = (key: string, type?: string) => {
    router.push({
        name: key,
        query: {
            type
        }
    })
}
//我的文章列表
const myArticle = [
    {
        index: '/profile/article/all',
        router: 'profileArticle',
        type: 'all',
        title: '全部',
    },
    {
        index: '/profile/article/draft',
        router: 'profileArticle',
        type: 'draft',
        title: '草稿',
    },
    {
        index: '/profile/article/pending',
        router: 'profileArticle',
        type: 'pending',
        title: '待审核',
    },
    {
        index: '/profile/article/published',
        router: 'profileArticle',
        type: 'published',
        title: '已发布',
    },
    {
        index: '/profile/article/offline',
        router: 'profileArticle',
        type: 'offline',
        title: '已下线',
    }
]
const openMenu = computed(() => {
    const list: string[] = []
    getMenuOpen(router.currentRoute.value.path, '/profile/article', '/profile/article', list)
    return list
})
const activeMenu = computed(() => {
    const queryType = route.query.type as string
    if (router.currentRoute.value.path.startsWith('/profile/article')) {
        return getActiveMenu(queryType, '/profile/article', myArticle)
    }
    return '/profile/info'
})
</script>

<style scoped lang="scss">
.aside-page {
    height: 100vh;
    background-color: #f5f7fa;

    .info {
        margin: 20px 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;

        .avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
        }

        .nickname {
            font-size: 16px;
            font-weight: 700;
            color: #4e5564;
        }
    }
}
</style>