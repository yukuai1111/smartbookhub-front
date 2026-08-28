f<template>
    <div class="header-page">
        <div class="left">
            <el-image class="logo" :src="imgUrl" alt="logo" fit="cover" />
            <span class="title">智能图书管理系统</span>
        </div>
        <div class="right">
            <div class="menus" v-if="!isAdmin">
                <div class="menu-item" @click="router.push({ name: 'home' })"
                    :class="{ 'active': router.currentRoute.value.name === 'home' }">首页</div>
                <span class="divider">|</span>
                <div class="menu-item" @click="router.push({ name: 'articleSquare' })"
                    :class="{ 'active': router.currentRoute.value.name === 'articleSquare' }">知识广场</div>
                <span class="divider">|</span>
                <div class="menu-item" @click="router.push({ name: 'aiConversation' })"
                    :class="{ 'active': router.currentRoute.value.name === 'aiConversation' }">AI助手</div>
                <span class="divider">|</span>
                 <div class="menu-item" @click="router.push({ name: 'about' })"
                    :class="{ 'active': router.currentRoute.value.name === 'about' }">关于</div>
                <span class="divider">|</span>
            </div>
            <el-button v-if="userStore.isLogin && userStore.userinfo" color="#2774d9"
                @click="addArticle">新增文章</el-button>
            <div class="user" v-if="userStore.isLogin && userStore.userinfo">
                <el-avatar :src="`${avatarBaseUrl}${userStore.userinfo.avatar}`" />
                <el-dropdown size="large" @command="handleCommand">
                    <span class="username">
                        {{ userStore.userinfo.nickname }}
                        <el-icon class="el-icon--right">
                            <arrow-down />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="profile"
                                v-if="userStore.userinfo.userType === 0">个人中心</el-dropdown-item>
                            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
            <div v-else class="login-register">
                <div class="login-btn" @click="router.push({ name: 'logReg', query: { type: 'login' } })">登录</div>
                <span>/</span>
                <div class="register-btn" @click="router.push({ name: 'logReg', query: { type: 'register' } })">注册</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { ArrowDown } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useAiStore } from '@/stores/aiStore'
import { useArticleStore } from '@/stores/articleStore'
import { ElMessage, ElMessageBox } from 'element-plus'
const userStore = useUserStore()
const aiStore = useAiStore()
const router = useRouter()
const articleStore = useArticleStore()
const avatarBaseUrl = import.meta.env.VITE_IMG_BASEURL
const imgUrl = new URL(`@/assets/images/logo.png`, import.meta.url).href
const isAdmin = computed(() => userStore.userinfo?.userType === 1)

//点击下拉菜单
const handleCommand = (command: string) => {
    if (command === 'logout') {
        ElMessageBox.confirm('确定退出登录吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            if (aiStore.currentControllerKey) {
                //退出登录时清除所有控制器会话
                aiStore.removeAllControllers()
                ElMessage.warning('会话已中断')
            }
            userStore.clearUserInfo()
            ElMessage.success('退出登录成功')
            router.push({ name: 'home' })
        }).catch(() => {
            ElMessage.info('已取消退出登录')
        })
    } else if (command === 'profile') {
        router.push({ name: 'profile' })
    }
}

//新增文章
const addArticle = () => {
    if (!isAdmin.value) {
        articleStore.openAddArticleDialog('front')
    } else {
        articleStore.openAddArticleDialog('admin')
    }
}
</script>

<style scoped lang="scss">
.header-page {
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #1e2936;
    height: 90px;

    .left {
        border-radius: 10px;
        overflow: hidden;
        width: 60%;
        display: flex;
        align-items: center;
        gap: 10px;

        .logo {
            border-radius: 10px;
            width: 60px;
            height: 60px;
        }

        .title {
            font-size: 22px;
            font-weight: 600;
            color: #fff;
            letter-spacing: 1px;
            user-select: none;
        }

    }

    .right {
        width: 100%;
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-right: 40px;

        .el-button {
            margin-right: 20px;
            font-size: 15px;
            padding: 20px;
            border-radius: 10px;
        }

        .menus {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 20px;
            margin-right: 30px;

            .menu-item {
                cursor: pointer;
                font-size: 18px;
                color: #fff;
                transition: color 0.2s ease;

                &:hover {
                    color: #709fbc;
                }
            }

            .active {
                color: #3b7094;
                font-weight: 600;
            }

            .divider {
                font-size: 16px;
                color: #64748b;
            }
        }

        .login-register {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            cursor: pointer;
            font-size: 18px;
            gap: 10px;
            color: #94a3b8;

            .login-btn {
                color: #60a5fa;

                &:hover {
                    color: #ffffff;
                }
            }

            .register-btn {
                color: #a5b4fc;

                &:hover {
                    color: #ffffff;
                }
            }
        }


        .user {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;

            .username {
                font-size: 15px;
                color: #ffffff;
                user-select: none;
            }

        }
    }
}
</style>