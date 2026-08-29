<template>
    <Header />
    <div class="comment-page">
        <div class="nav" @click="router.back()">
            <div class="nav-icon">
                <el-icon size="29">
                    <CaretLeft />
                </el-icon>
            </div>
            <div class="nav-text">
                返回
            </div>
        </div>
        <div class="comment">
            <div class="comment-list">
                <!-- 获取评论出错 -->
                <div v-if="commentList.length === 0 && errMsg">
                    <el-empty :description="errMsg">
                        <el-button :loading="retryLoading" type="primary" @click="getComment">重新获取</el-button>
                    </el-empty>
                </div>
                <el-scrollbar height="100%" @end-reached="loadMore" :distance="50">
                    <!-- 没出错但没评论 -->
                    <div v-if="commentList.length === 0 && !errMsg">
                        <el-empty description="暂无评论" />
                    </div>
                    <!-- 有评论 -->
                    <div v-else>
                        <div class="comment-item" v-for="item in commentList" :key="item.commentId"
                            :style="{ backgroundColor: item.commentIsDeleted ? '#e2e8f0' : '#f6fafe' }"
                            :class="{ flash: item.commentId === highlightCommentId }" :id="`comment-${item.commentId}`">
                            <!-- 根评论 -->
                            <div class="father">
                                <div class="avatar">
                                    <el-image style="width: 50px;height: 50px;height: 50px;border-radius: 50%;"
                                        fit="cover" :src="avatarBaseurl + item.commentAvatar"></el-image>
                                </div>
                                <div class="info">
                                    <div class="name">
                                        {{ item.commentName }}
                                    </div>
                                    <div class="content" v-if="!item.commentIsDeleted">
                                        {{ item.commentContent }}
                                    </div>
                                    <div class="content" v-else>
                                        该评论已删除
                                    </div>
                                    <div class="time">
                                        <div class="item">{{ formatTime(item.commentCreateTime) }} </div>
                                        <div class="item reply" v-if="!item.commentIsDeleted" @click="replyOther(item)">
                                            回复</div>
                                        <!-- 管理员和自己的文章/自己的评论可以删除 -->
                                        <div class="item remove" @click="handleDelete(item)"
                                            v-if="!item.commentIsDeleted && (isAdmin || isPrivate || item.commentUserId === userStore.userinfo?.userId)">
                                            删除</div>
                                    </div>
                                    <el-divider @click="handleReply(item, false)" content-position="left" class="more"
                                        border-style="insert" v-if="item.replyCount !== 0">
                                        {{ item.isExpandReply ? `———收起回复` :
                                            `———展开${item.replyCount}条回复`
                                        }}
                                        <el-icon size="13">
                                            <ArrowDown />
                                        </el-icon>
                                    </el-divider>
                                </div>
                            </div>

                            <!-- 子评论 -->
                            <div v-show="item.isExpandReply" class="child">
                                <div class="child-item"
                                    :style="{ backgroundColor: child.commentIsDeleted ? '#e2e8f0' : '#f6fafe' }"
                                    v-for="child in replyMap.get(item.commentId) || []" :key="child.commentId"
                                    :id="`comment-${child.commentId}`"
                                    :class="{ flash: child.commentId === highlightCommentId }">
                                    <div class="child-avatar">
                                        <el-image style="width:35px;height: 35px;border-radius: 50%;" fit="cover"
                                            :src="avatarBaseurl + child.commentAvatar"></el-image>
                                    </div>
                                    <div class="child-info">
                                        <div class="name">
                                            {{ child.commentName }} 回复 @ {{ child.targetName }}
                                        </div>
                                        <div class="content" v-if="!child.commentIsDeleted">
                                            {{ child.commentContent }}
                                        </div>
                                        <div class="content" v-else>
                                            该评论已删除
                                        </div>
                                        <div class="time">
                                            <div class="item">{{ formatTime(child.commentCreateTime) }} </div>
                                            <div class="item reply" @click="replyOther(child)"
                                                v-if="!child.commentIsDeleted">回复</div>
                                            <!-- 管理员和自己的文章/自己的评论可以删除 -->
                                            <div class="item remove" @click="handleDelete(child)"
                                                v-if="!child.commentIsDeleted && (isAdmin || isPrivate || child.commentUserId === userStore.userinfo?.userId)">
                                                删除</div>
                                        </div>
                                    </div>
                                </div>
                                <el-divider v-if="remainCountMap.get(item.commentId) === 1"
                                    @click="handleReply(item, true)" border-style="insert" content-position="left"
                                    class="more more-child">
                                    {{ `———展开更多回复` }}
                                    <el-icon size="13" v-if="remainCountMap.get(item.commentId) === 1">
                                        <ArrowDown />
                                    </el-icon>
                                </el-divider>
                                <el-divider border-style="insert" content-position="left" class="nomore">
                                    <span v-if="remainCountMap.get(item.commentId) === 0"> ———没有更多回复 </span>
                                    <span @click="handleClose(item)" class="close">
                                        <el-icon>
                                            <ArrowUp />
                                        </el-icon>
                                        收起</span>
                                </el-divider>
                            </div>
                        </div>
                    </div>
                    <p v-if="loading" style="text-align: center;
                    padding: 24px 0;color: #909399;font-size: 14px;">加载中...</p>
                    <p v-if="noMore" style="padding: 24px 0;text-align: center;color: #c0c4cc;font-size: 13px;">没有更多评论了
                    </p>
                </el-scrollbar>
            </div>
            <div class="comment-send" v-if="!errMsg">
                <div class="avatar">
                    <el-image style="width:60px;height: 60px;" fit="cover"
                        :src="avatarBaseurl + userStore.userinfo!.avatar"></el-image>
                </div>
                <div class="send-container">
                    <div class="name">
                        {{ userStore.userinfo?.nickname }}
                    </div>
                    <div>
                        <div v-if="isReply.targetId" class="reply">
                            <span> 回复 @ {{ isReply.targetName }}：</span>
                            <span @click="cancelReply">
                                <el-icon size="20">
                                    <Close />
                                </el-icon>
                            </span>
                        </div>
                        <el-input v-model="commentData.content" :rows="2" show-word-limit maxlength="300"
                            type="textarea" placeholder="快来发表你的看法吧!" resize="none"></el-input>
                    </div>
                    <div class="btn">
                        <el-button type="success" size="large" @click="handleSend">发送</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getCommentList, getReplyList, deleteComment, sendComment } from '@/api/commentApi'
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import type { Comment } from '@/interface/comment'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/userStore'
import { CaretLeft, ArrowDown, Close, ArrowUp } from '@element-plus/icons-vue'
import { formatTime } from '@/utils/formatTime'
import { useScroll } from '@/hooks/useScroll'
import { useArticleStore } from '@/stores/articleStore'
const articleStore = useArticleStore()

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
//根评论
const commentList = ref<Comment[]>([])
//子评论集合
const replyMap = ref<Map<string, Comment[]>>(new Map())  //key:root_id, value:子评论列表
//每个根评论下还有多少个子评论没渲染到页面
const remainCountMap = ref<Map<string, number>>(new Map())  //key:root_id, value:是否还有更多数据（1有，0没有）
//每个根评论已经是第几页
const currentPageMap = ref<Map<string, number>>(new Map())  //key:root_id, value:当前页码
const isAdmin = computed(() => userStore.userinfo?.userType === 1) //是否是管理员
const authorId = computed(() => route.query.authorId as string) //文章作者id
const isPrivate = computed(() => userStore.userinfo?.userId === authorId.value) //是否是私有
const errMsg = ref<string>('')
const retryLoading = ref<boolean>(false)  //出错时是否重试加载
const avatarBaseurl = import.meta.env.VITE_IMG_BASEURL
//根评论加载更多数据
const loading = ref<boolean>(false)
//根评论是否没有更多评论
const noMore = ref<boolean>(false)
//高亮评论id
const highlightCommentId = ref<string | null>(null)
//滚动到指定元素
const { scrollById } = useScroll()

const isReply = reactive<{
    targetName: string,  //回复的评论人姓名
    targetId: string,
    rootId: string | null,
    targetData: Comment | null
}>({
    targetName: '',  //回复的评论人姓名
    targetId: '',
    rootId: null as string | null,  //根评论id
    targetData: null //回复的评论信息
})
//只负责根评论
const commentData = reactive({
    articleCode: '',
    page: 1,  //只负责根评论的分页
    pageSize: 18,
    content: '',
})
const getComment = async () => {
    if (errMsg.value) {
        if (retryLoading.value) return
        retryLoading.value = true
    }
    try {
        const res = await getCommentList(
            {
                articleCode: commentData.articleCode,
                page: commentData.page,
                pageSize: commentData.pageSize
            })
        if (res.data) {
            commentList.value = [...commentList.value, ...res.data.commentList.map(item => {
                item.isExpandReply = false
                return item
            })]
            console.log(commentList.value)
            //如果获取的新数据的条数已经小于pageSize，说明没有更多评论了
            if (res.data.commentList.length < commentData.pageSize) {
                noMore.value = true
            }
            errMsg.value = ''
        }
    } catch (err) {
        errMsg.value = '网络有误，请重试'
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
//展开评论子评论
const handleReply = async (item: Comment, isChild: boolean, isRefresh: boolean = false) => {
    const rootId = item.commentId  //根评论id
    const isCache = replyMap.value.has(rootId)
    //收起：已展开/不是加载更多/不是刷新
    if (item.isExpandReply && !isChild && !isRefresh) {
        item.isExpandReply = false
        return
    }
    //非法操作
    if (!item.isExpandReply && isChild) {
        ElMessage.error('请先展开父评论')
        return
    }
    //收起：已经有缓存/非刷新/非加载更多
    if (!item.isExpandReply && !isChild && isCache && !isRefresh) {
        item.isExpandReply = true
        return
    }

    //读取页码，兜底1（防止一次都没有展开过的情况）
    let subPage = currentPageMap.value.get(rootId) || 1
    //如果是刷新，重置为1
    if (isRefresh) {
        subPage = 1
    } else if (item.isExpandReply && isChild) {
        //如果展开且是子评论触发的，页数+1
        subPage++
    }
    //更新当前页码
    currentPageMap.value.set(rootId, subPage)
    try {
        const res = await getReplyList({
            articleCode: commentData.articleCode,
            rootId: item.commentId,
            page: subPage
        })
        if (res.data) {
            item.isExpandReply = true
            // item.replyCount++
            //获取旧的子评论列表
            let oldReply = replyMap.value.get(rootId) || []
            //追加新数据
            replyMap.value.set(rootId, [...oldReply, ...res.data.commentList])
            //判断是否还有更多数据
            if (res.data.size < 5) {
                remainCountMap.value.set(rootId, 0)
            } else {
                remainCountMap.value.set(rootId, 1)
            }
        }
    } catch (err) {
        if (err instanceof Error) {
            ElMessage.error(err.message)
        } else {
            ElMessage.error(err as string)
        }
    }
}

//回复
const replyOther = (item: Comment) => {
    isReply.targetName = item.commentName
    isReply.targetId = item.commentId
    isReply.rootId = item.root_id || null
    isReply.targetData = item
}
//取消回复
const cancelReply = () => {
    isReply.targetName = ''
    isReply.targetId = ''
    isReply.rootId = null
    isReply.targetData = {} as Comment
    commentData.content = ''
}
//触底加载
const loadMore = () => {
    if (loading.value) return
    if (noMore.value) {
        return
    }
    commentData.page++
    loading.value = true
    setTimeout(async () => {
        await getComment()
        loading.value = false
    }, 1000)
}

//删除评论
const handleDelete = (comment: Comment) => {
    ElMessageBox.confirm('确认删除该评论吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        try {
            await deleteComment(commentData.articleCode, comment.commentId)
            comment.commentIsDeleted = true
            ElMessage.success('删除成功')
        } catch (err) {
            if (err instanceof Error) {
                ElMessage.error(err.message)
            } else {
                ElMessage.error(err as string)
            }
        }
    })
}
//发送评论
const handleSend = async () => {
    let comment: Comment | null = null  //回复的评论信息
    if (!commentData.content) {
        ElMessage.error('请输入评论内容')
        return
    }
    //如果存在回复评论id，就是回复评论
    if (isReply.targetId && isReply.targetData) {
        comment = isReply.targetData
    }
    try {
        const res = await sendComment(
            commentData.articleCode,
            commentData.content,
            isReply.targetId)
        //往评论列表添加一条评论
        if (res.data) {
            const rootId = res.data.rootId
            //如果是回复
            if (isReply.targetId && comment) {
                //被回复数自增
                //获取根评论数据
                let rootData: Comment | null = null
                if (comment.root_id) {
                    //回复的是子评论
                    rootData = commentList.value.find(item => item.commentId === rootId) || null
                } else {
                    //回复的是根评论
                    rootData = comment
                }
                if (!rootData) return
                /*
                // const tempComment = {
                //     commentId: res.data.commentId,
                //     article_code: commentData.articleCode,
                //     commentContent: commentData.content,
                //     commentUserId: userStore.userinfo?.userId || '',
                //     commentCreateTime: Date.now(),
                //     reply_id: replyId,
                //     root_id: rootId,
                //     replyCount: 0,
                //     commentName: userStore.userinfo?.nickname || '',
                //     commentAvatar: userStore.userinfo?.avatar || '',
                //     commentIsDeleted: false,
                //     targetName: comment.commentName,
                //     targetUserId: comment.commentUserId,
                //     targetIsDeleted: false,
                //     isExpandReply: false,
                //     //是否本地临时数据
                //     isLocal: true
                // }
                // //总数+1
                // rootData.replyCount++
                // //更新回复评论数据
                // //获取旧数据
                // let oldReply = replyMap.value.get(rootId) || []
                // //追加新数据（临时数据）
                // oldReply.unshift(tempComment)
                // replyMap.value.set(rootId, oldReply)
                // //如果根评论没展开就自动展开
                // if (!rootData.isExpandReply) {
                //     rootData.isExpandReply = true
                //     rootData.isForceExpandReply = true
                // }
                // //更新剩下的子评论数
                // //如果从没展开过，但有数据（本地自己渲染的），才计算remain
                // if (!currentPageMap.value.has(rootId) && replyMap.value.get(rootId)) {
                //     //重置当前页码为1
                //     //如果总回复>已渲染的，说明还有更多数据
                //     if (rootData.replyCount > oldReply.length) {
                //         remainCountMap.value.set(rootId, 1)
                //     } else {
                //         remainCountMap.value.set(rootId, 0)
                //     }
                // }
                */
                //根评论的回复数+1
                rootData.replyCount++
                // 清除缓存
                replyMap.value.delete(rootId)
                remainCountMap.value.delete(rootId)
                currentPageMap.value.delete(rootId)
                //刷新评论列表
                await handleReply(rootData, false, true)
            }
            else {
                commentData.page = 1
                commentList.value = []
                await getComment()
            }
            cancelReply()
            await nextTick()
            //滚动到指定元素
            await scrollById(`comment-${res.data.commentId}`)
            //高亮评论id
            highlightCommentId.value = res.data.commentId
            setTimeout(() => {
                highlightCommentId.value = null
            }, 1500)
            //统计可以更新
            articleStore.isTotalRefresh = true
        }
    } catch (err) {
        if (err instanceof Error) {
            ElMessage.error(err.message)
        } else {
            ElMessage.error(err as string)
        }
    }
}

//收起评论
const handleClose = async (item: Comment) => {
    item.isExpandReply = false
    //滚动到指定元素
    await scrollById(`comment-${item.commentId}`)
}
onMounted(async () => {
    commentData.articleCode = route.query.articleCode as string
    await getComment()
})
</script>

<style scoped lang="scss">
.comment-page {
    background-color: #edf2f7;
    padding: 30px 100px;
    overflow: hidden;
    height: calc(100vh - 105px);

    .nav {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        color: #86909c;
        cursor: pointer;
        flex-shrink: 0;

        .nav-icon {
            margin-right: 4px;
        }

        .nav-text {
            font-size: 15px;
            font-weight: 700;

        }
    }

    .reply {
        color: #6c6e72;
        cursor: pointer;

        &:hover {
            color: #409eff;
        }
    }

    .remove {
        color: #c96060;
        cursor: pointer;

        &:hover {
            color: #ff4949;
        }
    }

    .name {
        font-size: 15px;
        color: #606266;
    }

    .content {
        width: 100%;
        font-size: 15px;
        color: #303133;
    }

    .time {
        font-size: 14px;
        color: #909399;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 16px;
    }

    .more {
        :deep(.el-divider__text) {
            width: 200px;
            margin-top: -10px;
            margin-left: -40px;
            background-color: transparent;
            cursor: pointer;
            font-size: 13px;
            color: #686b70;

            &:hover {
                color: #409eff;
            }
        }
    }

    .comment {
        box-shadow: 0 1px 4px rgba(64, 158, 255, 0.08);
        position: relative;
        flex: 1;
        margin-left: auto;
        margin-right: auto;
        width: 90%;
        padding-bottom: 250px;
        overflow: hidden;
        height: calc(100vh - 120px);
        border-radius: 8px;

        .comment-list {
            height: 100%;
            flex: 1;
            overflow-y: auto;
            padding: 20px;

            .comment-item {
                border-radius: 20px;
                padding: 12px;
                margin-bottom: 30px;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: flex-start;
                background-color: #f5faf7;
                gap: 12px;

                // 根评论
                .father {
                    display: flex;
                    align-items: flex-start;
                    justify-content: flex-start;
                    gap: 12px;
                    width: 100%;
                    border-radius: 20px;
                    padding: 12px;

                    .info {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        gap: 10px;
                    }

                    &:last-child {
                        margin-bottom: 0;
                    }
                }

                // 子评论
                .child {
                    width: calc(100% - 40px);
                    margin-left: 40px;
                    padding-left: 10px;
                    border-left: 2px solid #e4e7ed;

                    .child-item {
                        border-radius: 20px;
                        padding: 12px;
                        margin-bottom: 40px;
                        display: flex;
                        align-items: flex-start;
                        justify-content: flex-start;
                        gap: 12px;

                        .child-info {
                            flex: 1;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            gap: 10px;
                        }
                    }

                    .more-child {
                        :deep(.el-divider__text) {
                            margin-left: 0;
                        }
                    }

                    .nomore {

                        :deep(.el-divider__text) {
                            background-color: transparent;
                            font-size: 13px;
                            color: #686b70;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            gap: 30px;

                            .close {
                                cursor: pointer;

                                &:hover {
                                    color: #409eff;
                                }
                            }
                        }
                    }
                }
            }

        }

        .comment-send {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 20px;
            margin-bottom: 50px;
            display: flex;
            align-items: flex-start;
            justify-content: flex-start;
            background: #f0f6fb;
            /*发送框浅蓝*/
            border-radius: 10px;
            border-top: 1px solid #dce8f3;
            /*淡蓝分割线*/

            .send-container {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                gap: 12px;
                margin-left: 20px;

                .reply {
                    font-size: 13px;
                    color: #606266;
                    margin-bottom: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    gap: 10px;

                    .el-icon {
                        cursor: pointer;

                        &:hover {
                            color: #409eff;
                        }
                    }
                }

                .name {
                    font-size: 20px;
                    font-weight: 700;

                }

                :deep(.el-textarea__inner) {
                    padding: 15px;
                    font-size: 15px
                }

                .btn {
                    border-radius: 20px;

                    .el-button {
                        font-size: 15px
                    }
                }
            }
        }
    }
}

.flash {
    animation: commentFlash 1.4s ease-out;
}

@keyframes commentFlash {
    0% {
        background-color: transparent;
    }

    50% {
        background-color: #b8d0e8;
    }

    100% {
        background-color: transparent;
    }
}
</style>
