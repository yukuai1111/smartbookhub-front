<template>
    <div class="conversation-page">
        <Header />
        <div class="content">
            <el-container>
                <el-aside :width="aiStore.foldStatus ? '0' : '400px'">
                    <div class="header">
                        <el-icon>
                            <Grid />
                        </el-icon>
                        会话列表
                    </div>
                    <div class="menu" ref="menuRef">
                        <!-- 获取错误 -->
                        <div class="empty" v-if="errMsg">
                            <el-empty :description="errMsg">
                                <el-button :loading="retryLoading" type="primary"
                                    @click="getConversation">重新获取</el-button>
                            </el-empty>
                        </div>
                        <!-- 空列表 -->
                        <div class="empty" v-if="!errMsg && conversationList.length === 0">
                            <el-empty description="暂无会话"/>
                        </div>
                        <!-- 正常渲染 -->
                        <div v-if="!errMsg && conversationList.length > 0" :class="{ 'active': activeId === item.id }"
                            @click="handleDetail(item.id)" v-for="item in conversationList" :key="item.id"
                            class="menu-item">
                            <div class="info">
                                <div class="title">📚{{ item.title }}</div>
                                <div class="time">☀️开始时间：{{ dayjs(item.start_time).format('YYYY-MM-DD HH:mm:ss') }}
                                </div>
                                <div class="time">🌙结束时间：{{ dayjs(item.end_time).format('YYYY-MM-DD HH:mm:ss') }}</div>
                            </div>
                            <div class="action">
                                <el-icon size="25" @click.stop="handleDelete(item.id)">
                                    <Delete />
                                </el-icon>
                            </div>
                        </div>
                    </div>
                </el-aside>
                <el-container>
                    <el-header>
                        <div class="top">
                            <div class="icon">
                                <el-icon size="25" @click="aiStore.toggleFold">
                                    <Fold v-if="!aiStore.foldStatus" />
                                    <Expand v-else />
                                </el-icon>
                            </div>
                            <div class="title">{{ conversationTitle }}</div>
                            <div class="add">
                                <el-icon size="25" @click="addSession">
                                    <Plus />
                                </el-icon>
                            </div>
                        </div>

                    </el-header>
                    <el-main>
                        <div class="messages-list" ref="chatRef">
                            <!-- 新对话 -->
                            <div class="message-item assistant" v-if="isNewSession">
                                <div class="avatar">
                                    <el-image class="img" fit="cover" :src="aiAvatar"></el-image>
                                </div>
                                <div class="message-bubble">
                                    <div class="message-text">
                                        你好👋！我是AI助手。你可以向我咨询各类和书籍相关的问题，例如书籍内容解读、人物分析、背景科普、读后感构思、书单参考，同时也可以向我提出其他各类问题，我可以帮你梳理思路、润色文本、整理信息、构思文案，欢迎在下方输入你的问题。
                                    </div>
                                    <div class="message-time">
                                        {{ dayjs(new Date()).format('HH:mm') }}
                                    </div>
                                </div>

                            </div>
                            <!-- 历史对话 -->
                            <div v-if="conversationDetailList && conversationDetailList.length !== 0">
                                <div v-for="item in conversationDetailList"
                                    :key="'temp_id' in item ? item.temp_id : item.message_id">
                                    <div class="message-item assistant" v-if="item.role === 'assistant'">
                                        <div class="avatar">
                                            <el-image class="img" fit="cover" :src="aiAvatar"></el-image>
                                        </div>
                                        <div class="message-bubble">
                                            <!-- AI占位符 -->
                                            <div v-if="'loading' in item && item.loading" class="loading-dot">
                                                <div class="message-text"> AI思考中</div>
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                            <!-- 正常消息 -->
                                            <div class="message-text" v-else>
                                                {{ item.message }}
                                            </div>
                                            <div class="message-time">
                                                {{ formatTime(item.send_time) }}
                                                <!-- 删除按钮 -->
                                                <el-icon v-if="item.message_id && ('status' in item && item.status !==1)" size="20" class="delete"
                                                    @click="handleDeleteMessage(item.message_id)">
                                                    <Delete />
                                                </el-icon>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="message-item user" v-else>
                                        <div class="message-bubble">
                                            <div class="message-text">
                                                {{ item.message }}
                                            </div>
                                            <div class="message-time">
                                                {{ formatTime(item.send_time) }}
                                                <!-- 删除按钮 -->
                                                <el-icon v-if="item.message_id" size="20" class="delete"
                                                    @click="handleDeleteMessage(item.message_id)">
                                                    <Delete />
                                                </el-icon>
                                            </div>
                                        </div>
                                        <div class="avatar">
                                            <el-image class="img" fit="cover"
                                                :src="avatarBaseurl + userStore.userinfo?.avatar"></el-image>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-main>
                    <el-footer>
                        <div class="footer">
                            <el-input type="textarea" clearable v-model="message" :maxlength="800" show-word-limit
                                resize="none" :rows="3" placeholder="✨ 有什么想了解的，尽管提问吧"></el-input>
                            <div class="btn">
                                <el-button type="primary" size="large" @click="send">发送</el-button>
                            </div>
                        </div>
                    </el-footer>
                </el-container>
            </el-container>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { getConversationList, deleteConversation, getConversationDetail, deleteMessage } from '@/api/frontApi'
import type { Conversation, ConversationDetail, TempConversationDetail, AiPlaceholder, AIRequest } from '@/interface/front'
import { Grid, Delete, Fold, Plus, Expand } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useAiStore } from '@/stores/aiStore'
import { useUserStore } from '@/stores/userStore'
import { useScroll } from '@/hooks/useScroll'
import { streamPost } from '@/utils/request'
import { formatTime } from '@/utils/formatTime'
import { useArticleStore } from '@/stores/articleStore'
const { scrollRef: chatRef, scrollBottom } = useScroll()
const { scrollRef: menuRef, scrollTop } = useScroll()

const userStore = useUserStore()
const articleStore = useArticleStore()

const aiStore = useAiStore()
const avatarBaseurl = import.meta.env.VITE_IMG_BASEURL
const aiAvatar = computed(() => new URL(`../assets/images/aiAvatar.jpg`, import.meta.url).href)
const conversationList = ref<Conversation[]>([])
const message = ref('')
const conversationDetailList = ref<(ConversationDetail | TempConversationDetail | AiPlaceholder)[]>([])
const isNewSession = ref(true)
const conversationTitle = ref('新对话')
const activeId = ref('')
const errMsg = ref('')
const retryLoading = ref(false)
//获取历史会话
const getConversation = async () => {
    if (errMsg.value) {
        retryLoading.value = true
    }
    try {
        const res = await getConversationList()
        if (res.data) {
            conversationList.value = res.data.conversationList
            errMsg.value = ''
        }
    } catch (err) {
        errMsg.value = '网络有误，请重新获取'
        if (err instanceof Error) {
            errMsg.value = err.message
            ElMessage.error(err.message)
        } else {
            errMsg.value = err as string
            ElMessage.error(err as string)
        }
    } finally {
        retryLoading.value = false
    }
}
//删除会话
const handleDelete = async (id: string) => {
    ElMessageBox.confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        try {
            const res = await deleteConversation(id)
            if (res.data) {
                ElMessage.success(`删除会话${res.data.title}成功`)
            }
            if (id === activeId.value) {
                if (aiStore.currentControllerKey) {
                    aiStore.removeOneController(aiStore.currentControllerKey as string, true)
                    isNewSession.value = true
                    ElMessage.warning('会话已中断')
                }
                activeId.value = ''
                reset()
                isNewSession.value = true
            }
            getConversation()
        } catch (err) {
            if (err instanceof Error) {
                ElMessage.error(err.message)
            } else {
                ElMessage.error(err as string)
            }
        }
    }).catch(() => {
        ElMessage.info('已取消删除')
    })
}
//获取会话详情
const loadDetail = async (id: string) => {
    if (errMsg.value) {
        retryLoading.value = true
    }
    activeId.value = id
    try {
        const res = await getConversationDetail(id)
        if (res.data) {
            conversationDetailList.value = res.data.messages
            conversationTitle.value = res.data.title || '新对话'
            isNewSession.value = false
            await scrollBottom()
            errMsg.value = ''
        }
    } catch (err) {
        errMsg.value = '网络有误，请重新获取'
        if (err instanceof Error) {
            ElMessage.error(err.message)
        } else {
            errMsg.value = err as string
            ElMessage.error(err as string)
        }
    } finally {
        retryLoading.value = false
    }
}
const handleDetail = async (id: string) => {
    //判断有没有控制器，有的话要删除
    if (aiStore.currentControllerKey) {
        ElMessageBox.confirm('AI正在回复中，切换会话将中断本次回答，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }).then(async () => {
            const currentControllerKey = aiStore.currentControllerKey
            //取消当前的请求
            aiStore.removeOneController(currentControllerKey as string, true)
            await loadDetail(id)
        }).catch(() => {
        })
        return
    }
    await loadDetail(id)
}
//发送消息
const send = async () => {
    if (!message.value.trim()) {
        ElMessage.warning('请输入消息！')
        return
    }
    if (isNewSession.value) {
        //会话列表滚动到最上面
        await scrollTop()
    }
    //新消息渲染页面
    const text = message.value.trim()
    //如果一开始ai还在运行，要先把当前的ai消息打取消标记
    if (aiStore.currentControllerKey) {
        const oldTempId = aiStore.getCurrentTempId(aiStore.currentControllerKey)
        if (oldTempId) {
            const oldMsg = conversationDetailList.value.
                find((item): item is AiPlaceholder => 'temp_id' in item && item.temp_id === oldTempId)
            if (oldMsg) {
                oldMsg.loading = false
                oldMsg.status = 3
                oldMsg.isTemp = false
            }
            //删除旧的控制器
            aiStore.removeOneController(aiStore.currentControllerKey as string, true)
        }
    }
    //用户消息占位符
    const userTempId = 'user_temp_' + Date.now()
    conversationDetailList.value.push( {
    temp_id: userTempId,
    role: 'user',
    message: text,
    send_time: Date.now(),
    isTemp: true,
    message_id: null
})
    //ai占位符
    const aiTempId = 'ai_temp_' + Date.now()
    conversationDetailList.value.push({
        temp_id: aiTempId,
        role: 'assistant',
        message: '',
        send_time: Date.now(),
        isTemp: true,
        loading: true,
        message_id: null,
        status:1 //1:生成中，2:已生成 3：已取消生成
    })
    message.value = ''
    isNewSession.value = false
    await scrollBottom()
    try {
        //创建控制器
        const controllerKey = `ctrl_${Date.now()}`
        const controller = aiStore.createController(controllerKey, aiTempId)
        let streamBody: AIRequest = {
            message: text
        }
        if (activeId.value) {
            //旧对话
            streamBody.conversationId = activeId.value
        }
        streamPost('/front/ai/send', streamBody,
            (res) => {
                //有会话id返回
                if (res.type === 'conv_id') {
                    if (res.session_id && !activeId.value) {
                        //只有创建新会话才需要更新会话id
                        activeId.value = res.session_id
                        getConversation()
                    }
                    const tempUserItem = conversationDetailList.value.find
                        ((item): item is TempConversationDetail =>
                            item.role === 'user' && 'isTemp' in item && item.isTemp &&
                            item.temp_id === userTempId)
                    if (tempUserItem && res.message_id) {
                        tempUserItem.message_id = res.message_id
                        tempUserItem.isTemp = false
                    }
                    const tempAiItem = conversationDetailList.value.find
                        ((item): item is AiPlaceholder =>
                            item.role === 'assistant' && 'isTemp' in item && item.isTemp &&
                            item.temp_id === aiTempId)
                    if (tempAiItem && res.ai_msgId) {
                        tempAiItem.message_id = res.ai_msgId
                        tempAiItem.status = 1
                    }
                }
                if (res.type === 'onchunk') {
                    //AI开始返回
                    const tempAiItem = conversationDetailList.value.
                        find((item): item is AiPlaceholder =>
                            item.role === 'assistant' && 'isTemp' in item && item.isTemp &&
                            item.temp_id === aiTempId)
                    if (!tempAiItem) return
                    if (res.content) {
                        if (tempAiItem.loading) tempAiItem.loading = false
                        tempAiItem.message += res.content
                    }
                }
            },
            async () => {
                //请求完成
                const tempAiItem = conversationDetailList.value.
                    find((item): item is AiPlaceholder => item.role === 'assistant' && 'isTemp' in item && item.isTemp)
                if (tempAiItem) {
                    tempAiItem.isTemp = false
                    tempAiItem.status = 2
                }
                if (activeId.value) {
                    console.log('刷新标题')
                    Promise.all([
                        getConversation(),
                        (async () => {
                            const res = await getConversationDetail(activeId.value)
                            if (res.data) {
                                conversationTitle.value = res.data.title
                                console.log('刷新成功', res.data.title)
                            }
                        })()
                    ]).catch(err => {
                        console.error('刷新失败', err)
                    })
                } else {
                    getConversation()
                }
                articleStore.isTotalRefresh=true
                //清除控制器
                aiStore.removeOneController(controllerKey)
                ElMessageBox.close()
            },
            (err) => {
                const tempAiItem = conversationDetailList.value.
                    find((item): item is AiPlaceholder => item.role === 'assistant' && 'isTemp' in item && item.isTemp)
                if (tempAiItem) {
                    tempAiItem.isTemp = false
                    tempAiItem.message = err
                    tempAiItem.loading = false
                    tempAiItem.status = 3
                }
                //清除控制器
                aiStore.removeOneController(controllerKey)
            },
            controller
        )

    } catch (err) {
        if (err instanceof Error) {
            ElMessage.error(err.message)
        } else {
            ElMessage.error(err as string)
        }
    }
}
const addSession = () => {
    //判断有没有控制器，有的话要删除
    if (aiStore.currentControllerKey) {
        ElMessageBox.confirm('AI正在回复中，新增会话将中断本次回答，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }).then(async () => {
            const currentControllerKey = aiStore.currentControllerKey
            //取消当前的请求
            aiStore.removeOneController(currentControllerKey as string, true)
            isNewSession.value = true
            reset()
        }).catch(() => {
        })
        return
    }
    isNewSession.value = true
    reset()
}
//删除消息
const handleDeleteMessage = (message_id: number) => {
    ElMessageBox.confirm('确定删除吗，删除后将无法恢复！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        try {
            console.log('删除消息', message_id)
            //删除消息
            await deleteMessage(message_id)
            ElMessage.success('删除成功')
            //过滤删除的消息
            conversationDetailList.value = conversationDetailList.value.filter(item => item.message_id !== message_id)
        } catch (err) {
            if (err instanceof Error) {
                ElMessage.error(err.message)
            } else {
                ElMessage.error(err as string)
            }
        }
    }).catch(() => {
        ElMessage.info('删除已取消')
    })
}
//重置
const reset = () => {
    activeId.value = ''
    message.value = ''
    conversationTitle.value = '新对话'
    conversationDetailList.value = []
}
onMounted(() => {
    getConversation()
})
onBeforeUnmount(() => {
    console.log('组件卸载时清除控制器')
    if (aiStore.currentControllerKey) {
        //组件卸载时清除控制器
        aiStore.removeOneController(aiStore.currentControllerKey as string, true)
        ElMessage.warning('会话已中断')
    }
})
</script>

<style scoped lang="scss">
.conversation-page {
    min-height: 100vh;

    .content {
        height: calc(100vh - 60px);

        .el-container {
            height: 100%;

            .el-aside {
                height: 100%;
                background-color: #f0f4f9;
                padding: 20px 15px;
                overflow: hidden;
                display: flex;
                flex-direction: column;

                .header {
                    flex-shrink: 0;
                    padding: 10px 0;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 20px;
                    font-weight: bold;
                    margin-bottom: 20px;
                }

                .menu {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: flex-start;
                    overflow-y: auto;

                    .empty {
                        flex: 1;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin: 0 auto
                    }

                    .menu-item {
                        width: 100%;
                        padding: 20px;
                        cursor: pointer;
                        transition: background-color 0.22s ease;
                        border-radius: 5px;
                        margin-bottom: 20px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        gap: 8px;
                        border-radius: 5px;

                        &:hover {
                            transition: transform 0.22s ease;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
                            background-color: #e6edf7;
                        }

                        &.active {
                            background-color: #d8e2f1;
                        }

                        .info {
                            display: flex;
                            flex-direction: column;
                            justify-content: flex-start;
                            align-items: flex-start;
                            gap: 8px;

                            .title {
                                font-size: 18px;
                                font-weight: 600;
                                color: #222222;
                                margin-bottom: 8px;
                            }

                            .time {
                                font-size: 14px;
                                color: #666666;
                                line-height: 1.6;

                            }
                        }

                        .action {
                            display: flex;
                            justify-content: flex-end;
                            align-items: center;
                            cursor: pointer;
                            margin-right: 35px;
                            color: #962d2f;

                            &:hover {
                                color: #f00;
                                transition: color 0.22s ease;
                                transform: scale(1.2);
                            }
                        }
                    }

                }
            }

            .el-header {
                height: 70px;
                padding: 0 20px;
                font-size: 20px;
                font-weight: bold;
                color: #222222;
                background-color: #fff;
                border-bottom: 2px solid #e2e8f0;

                .top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px;

                    .icon {
                        cursor: pointer;
                    }

                    .title {
                        font-size: 20px;
                        font-weight: bold;
                        color: #222222;
                    }

                    .add {
                        width: 36px;
                        height: 36px;
                        border-radius: 50%;
                        background-color: #c6d7ee;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        transition: all 0.2s ease;

                        &:hover {
                            background-color: #b0c7e3;
                        }
                    }
                }
            }

            .el-main {
                background-color: #f8f8fa;
                overflow: hidden;
                display: flex;

                .messages-list {
                    flex: 1;
                    padding: 10px;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    overflow-y: auto;

                    .message-item {
                        display: flex;
                        gap: 20px;
                        margin-bottom: 30px;

                        &.assistant {
                            justify-content: flex-start;

                            .message-bubble {
                                background: #d0dceb;
                                color: #1f2937;
                                border-radius: 12px 12px 12px 4px;
                                display: flex;
                                flex-direction: column;

                                .message-time {
                                    align-self: flex-start;
                                    color: #64748b;

                                    .delete {
                                        cursor: pointer;
                                        color: #86909c;
                                        transition: all 0.2s ease;

                                        &:hover {
                                            color: #f53f3f;
                                        }
                                    }
                                }
                            }
                        }

                        &.user {
                            justify-content: flex-end;

                            .message-bubble {
                                background: #4d6894;
                                color: #ffffff;
                                border-radius: 12px 12px 4px 12px;
                                display: flex;
                                flex-direction: column;

                                .message-time {
                                    color: #cbd5e1;
                                    align-self: flex-end;

                                    .delete {
                                        cursor: pointer;
                                        color: rgba(255, 255, 255, 0.65);
                                        transition: all 0.2s ease;

                                        &:hover {
                                            color: #fff;
                                        }
                                    }

                                }
                            }
                        }

                        .avatar {
                            width: 51px;
                            height: 51px;
                            border-radius: 50%;
                            overflow: hidden;

                            .img {
                                width: 100%;
                                height: 100%;
                            }
                        }

                        .message-bubble {
                            max-width: 60%;
                            padding: 12px 16px;

                            .message-text {
                                line-height: 1.6;
                                word-break: break-all;
                                white-space: pre-wrap;

                            }

                            .loading-dot {
                                display: flex;
                                gap: 8px;
                                align-items: flex-end;
                                padding: 4px 0;

                                span {
                                    width: 8px;
                                    height: 8px;
                                    border-radius: 50%;
                                    background-color: #999;
                                    animation: circleBlink 1.4s ease-in-out infinite;

                                    &:nth-child(2) {
                                        animation-delay: 0.2s;
                                    }

                                    &:nth-child(3) {
                                        animation-delay: 0.4s;
                                    }
                                }
                            }

                            .message-time {
                                font-size: 13px;
                                margin-top: 10px;
                                display: flex;
                                align-items: center;
                                gap: 5px;
                            }

                        }
                    }
                }
            }

            .el-footer {
                border-top: 2px solid #e2e8f0;
                height: 130px;

                .footer {
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 30px;
                    gap: 10px;

                    :deep(.el-textarea__inner) {
                        font-size: 16px;
                    }

                    .btn {
                        margin-left: 20px
                    }
                }
            }
        }

    }
}

@keyframes circleBlink {
    0% {
        opacity: 0.2;
        transform: scale(0.8);
    }

    50% {
        opacity: 1;
        transform: scale(1);
    }

    100% {
        opacity: 0.2;
        transform: scale(0.8);
    }
}
</style>
