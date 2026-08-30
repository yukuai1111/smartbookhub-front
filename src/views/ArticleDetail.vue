<template>
    <Header />
    <div class="article-page">
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
        <!-- 获取出错 -->
        <div v-if="errMsg">
            <el-empty :description="errMsg">
                <el-button :loading="retryLoading" type="primary" @click="getData">重新获取</el-button>
            </el-empty>
        </div>
        <div class="article-content" v-if="article && !errMsg">
            <div class="left">
                <div class="header">
                    <div class="title">{{ article.title }}</div>
                    <div class="info">
                        <div class="text">
                            作者：{{ article.author }} |
                            创建时间：{{ dayjs(article.createTime).format('YYYY-MM-DD HH:mm') }} |
                            更新时间：{{ dayjs(article.updateTime).format('YYYY-MM-DD HH:mm') }}
                        </div>
                        <div class="tag" v-if="isAdmin || isPrivate">
                            <el-tag size="large" :type="statusColor">{{ statusName }}</el-tag>
                        </div>
                    </div>
                </div>
                <el-image :preview-src-list="[coverBaseUrl + article.cover]" fit="fill"
                    style="width:100%;height: 260px;border-radius: 10px;" :src="coverBaseUrl + article.cover"
                    alt="文章封面"></el-image>
                <div class="desc">
                    <div class="title">文章摘要</div>
                    <div class="summary">
                        {{ article.summary }}
                    </div>
                </div>
                <div class="content">
                    <div class="content-text" v-html="article.content"></div>
                </div>
                <div class="actions">
                    <!-- 只能编辑自己的草稿/下线文章 -->
                    <el-button :loading="btnLoading" :disabled="btnLoading === true" type="primary" size="large"
                        @click="handleEdit" v-if="isPrivate && (status === 'draft' || status === 'offline')">
                        <el-icon>
                            <EditPen />
                        </el-icon>
                        <span class="action-text">编辑</span>
                    </el-button>
                    <!-- 审核，只有管理员以及不是管理员的文章才有 -->
                    <el-button :loading="btnLoading" :disabled="btnLoading === true" type="success" size="large"
                        v-if="!isPrivate && isAdmin && status === 'pending'" @click="handleApprove">
                        <el-icon><Select /></el-icon>
                        <span class="action-text">审核通过</span>
                    </el-button>
                    <el-button :loading="btnLoading" :disabled="btnLoading === true" type="warning" size="large"
                        v-if="!isPrivate && isAdmin && status === 'pending'" @click="rejectVisible = true">
                        <el-icon>
                            <CloseBold />
                        </el-icon>
                        <span class="action-text">审核拒绝</span>
                    </el-button>
                    <!-- 评论：上线的文章或者自己的下线文章，可以获取评论列表 -->
                    <el-button color="#5c4399" plain
                        v-if="article.status === 'published' || isPrivate && article.status === 'offline'"
                        type="primary" size="large"
                        @click="router.push({ name: 'comment', query: { articleCode, authorId: article.author_id } })">
                        <el-icon size="20">
                            <ChatDotSquare />
                        </el-icon>
                        <span class="action-text">评论{{ article.commentCount === 0 ? '(0)' : `(${article.commentCount})`
                        }}</span>
                    </el-button>
                </div>
            </div>
            <div class="right">
                <div class="sticky">
                    <div class="header">
                        <div class="title">文章信息</div>
                    </div>
                    <div class="info">
                        <div class="text" v-if="isAdmin || isPrivate">
                            <span class="label">文章状态：</span>
                            <span class="value status-value" :class="article.status">
                                <el-tag size="small" :type="statusColor">{{ statusName }}</el-tag>
                            </span>
                        </div>
                        <div class="text">
                            <span class="label"> 文章编码：</span>
                            <span class="value">{{ article.code }}</span>
                        </div>
                        <div class="text">
                            <span class="label"> 作者：</span>
                            <span class="value" style="cursor: pointer;"
                                @click="handleOtherUserHome(article.author_id)">{{ article.author }}</span>
                        </div>
                        <div class="text">
                            <span class="label">创建时间：</span>
                            <span class="value"> {{ dayjs(article.createTime).format('YYYY-MM-DD') }}</span>
                        </div>
                        <div class="text">
                            <span class="label"> 更新时间：</span>
                            <span class="value">{{ dayjs(article.updateTime).format('YYYY-MM-DD') }}</span>
                        </div>
                        <div class="text">
                            <span class="label"> 浏览量：</span>
                            <span class="value">{{ article.read_count }}</span>
                        </div>
                        <div class="text" v-if="isAdmin || isPrivate">
                            <span class="label">审核人：</span>
                            <span class="value">管理员</span>

                        </div>
                        <div class="text" v-if="isAdmin || isPrivate">
                            <span class="label">下线原因：</span>
                            <span class="value"> {{ article.offline_reason || '无' }}</span>
                        </div>
                        <div class="text" v-if="isAdmin || isPrivate">
                            <span class="label">下线时间：</span>
                            <span class="value">
                                {{ article.offlineTime ? dayjs(article.offlineTime).format('YYYY-MM-DD HH:mm') :
                                    '无' }}</span>
                        </div>
                        <div class="text" v-if="isAdmin || isPrivate">
                            <span class="label">驳回原因：</span>
                            <span class="value">{{ article.reject_reason || '无' }}</span>
                        </div>
                        <div class="text" v-if="isAdmin || isPrivate">
                            <span class="label">驳回时间：</span>
                            <span class="value">
                                {{ article.rejectTime ? dayjs(article.rejectTime).format('YYYY-MM-DD HH:mm') : '无'
                                }}</span>
                        </div>
                        <div class="reader" v-if="isPrivate && article.status !== 'pending'">
                            <span class="label">都有谁看?</span>
                            <span class="value">
                                <el-descriptions v-if="readerList.length > 0" :column="3" v-for="item in readerList"
                                    :key="item.id">
                                    <el-descriptions-item>
                                        <el-image :src="coverBaseUrl + item.avatar" fit="fill"
                                            style="width: 30px;height: 30px;border-radius: 50%;"
                                            :preview-src-list="[coverBaseUrl + item.avatar]" />
                                        <span @click="handleOtherUserHome(item.id)"> {{ item.readerName }}</span>
                                    </el-descriptions-item>
                                </el-descriptions>
                                <el-descriptions v-else>
                                    <el-descriptions-item>
                                        暂无读者，快去宣传吧！
                                    </el-descriptions-item>
                                </el-descriptions>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 编辑文章弹窗 -->
        <ArticleDialog :articleCode="articleCode" v-if="articleStore.dialogShow" :title="article!.title"
            :summary="article!.summary" :content="article!.content" :cover="article!.cover" />
        <!-- 审核不通过理由弹窗 -->
        <Reason @close="rejectVisible = false" @confirm="handleConfirm" :dialogVisible="rejectVisible" origin="reject"
            :btnLoading="btnLoading" />
    </div>
</template>

<script setup lang="ts">
import { CaretLeft, ChatDotSquare, EditPen, Select, CloseBold } from '@element-plus/icons-vue'
import { getArticleDetail, rejectArticle, approveArticle, getReaders } from '@/api/articleApi'
import type { ArticleInfo, Reader } from '@/interface/article'
import { ElMessage } from 'element-plus'
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { statusColorMap, statusNameMap } from '@/utils/statusMap'
import { useUserStore } from '@/stores/userStore'
import { useArticleStore } from '@/stores/articleStore'
const userStore = useUserStore()
const articleStore = useArticleStore()
const route = useRoute()
const router = useRouter()
const errMsg = ref<string>('')
const retryLoading = ref<boolean>(false)

const article = ref<ArticleInfo>()
const articleCode = ref<string>('')
const isAdmin = computed(() => userStore.userinfo?.userType === 1) //是否是管理员
const isPrivate = ref<boolean>(false) //是否是自己的文章（用户的个人主页/管理员自己的文章）
const status = ref<string>('')  //文章状态
const statusColor = computed(() => statusColorMap[status.value])
const statusName = computed(() => statusNameMap[status.value])
const coverBaseUrl = import.meta.env.VITE_IMG_BASEURL
const rejectVisible = ref<boolean>(false)
const btnLoading = ref<boolean>(false)
const readerList = ref<Reader[]>([])
//获取读者
const getReaderList = async () => {
    const res = await getReaders(articleCode.value)
    return res
}
const getDetail = async () => {
    const res = await getArticleDetail(articleCode.value)
    return res
}
//并行
const getData = async () => {
    if (errMsg.value) {
        retryLoading.value = true
    }
    try {
        //获取文章详情
        const resDetail = await getDetail()
        if (resDetail.data) {
            article.value = resDetail.data
            status.value = resDetail.data.status
            isPrivate.value = resDetail.data.author_id === userStore.userinfo?.userId ? true : false
            errMsg.value = ''
            //作者不是自己看不到文章列表
            if (!isPrivate.value) {
                readerList.value = []
                return
            }
            //判断文章状态（待审核看不到读者列表）
            if (status.value === 'pending') {
                readerList.value = []
                return
            }
        }

        //获取读者列表
        const resReader = await getReaderList()
        if (resReader.data) {
            readerList.value = resReader.data.readerList
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
//审核不通过
const handleConfirm = async (rejectReason: string) => {
    btnLoading.value = true
    try {
        const res = await rejectArticle(articleCode.value, rejectReason)
        if (res.data) {
            ElMessage.success(`文章${articleCode.value}已打回，理由：${rejectReason}`)
            articleStore.isListRefresh = true
            rejectVisible.value = false
            router.back()
        }
    } catch (err) {
        if (err instanceof Error) {
            ElMessage.error(err.message || '审核不通过失败')
        } else {
            ElMessage.error(err as string)
        }
    } finally {
        btnLoading.value = false
    }
}
//审核通过
const handleApprove = async () => {
    btnLoading.value = true
    try {
        const res = await approveArticle(articleCode.value)
        if (res.data) {
            ElMessage.success(`文章${articleCode.value}通过审核，已上线`)
            articleStore.isListRefresh = true
            router.back()
        }
    } catch (err) {
        if (err instanceof Error) {
            ElMessage.error(err.message || '审核通过失败')
        } else {
            ElMessage.error(err as string)
        }
    } finally {
        btnLoading.value = false
    }
}
//监听是否可以刷新文章详情
watch(() => articleStore.isDetailRefresh, async (newVal) => {
    if (newVal) {
        await getData()
        articleStore.isDetailRefresh = false
    }
})
//编辑文章
const handleEdit = () => {
    if (isAdmin.value) {
        articleStore.openEditArticleDialog('admin')
    } else {
        articleStore.openEditArticleDialog('front')
    }
}
//进入别人主页
const handleOtherUserHome = (userId: string) => {
    router.push({
        name: 'otherUserHome',
        query: {
            userId: userId
        }
    })
}
onMounted(() => {
    articleCode.value = route.query.articleCode as string
    getData()
})
</script>

<style scoped lang="scss">
.article-page {
    padding: 30px 100px;
    background-color: #f0f7ff;
    min-height: 100vh;

    .nav {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        color: #86909c;
        cursor: pointer;

        .nav-icon {
            margin-right: 4px;
        }

        .nav-text {
            font-size: 15px;
            font-weight: 700;

        }
    }

    .article-content {
        margin-top: 30px;
        display: flex;
        justify-content: space-between;
        height: 100%;
        gap: 20px;

        .left {
            position: relative;
            flex: 1;
            width: 70%;
            height: 100%;
            background-color: #fff;
            padding: 33px;
            border-radius: 10px;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
            overflow-y: auto;

            .header {
                margin: 5px 20px 25px;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;

                .title {
                    font-size: 26px;
                    font-weight: bold;
                }

                .info {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 10px;

                    .text {
                        font-size: 14px;
                        line-height: 2.1;
                        max-width: 700px;
                        opacity: 0.6;
                        text-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
                    }
                }
            }

            .desc {
                padding: 18px 20px;
                border-radius: 8px;
                background: #f7f8fa;
                font-size: 15px;
                line-height: 1.7;
                color: #4e5969;
                margin-top: 10px;

                .title {
                    font-size: 17px;
                    font-weight: bold;
                }

                .summary {
                    width: 100%;
                    padding: 10px;
                    font-size: 16px;
                    line-height: 2.1;
                    opacity: 0.9;
                    text-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
                    white-space: pre-wrap;
                    word-break: break-word;
                }

            }

            .content {
                padding: 20px;
                margin-bottom: 70px;

                :deep(ul) {
                    list-style-type: disc;
                    padding-left: 28px;
                    margin: 14px 0;
                }

                :deep(ol) {
                    list-style-type: decimal;
                    padding-left: 28px;
                    margin: 14px 0;
                }

                :deep(li) {
                    margin: 6px 0;
                }

                :deep(p) {
                    line-height: 1.8;
                    margin: 14px 0;
                }

                :deep(pre) {
                    margin: 20px 0;
                    background: #424c5c;
                    padding: 12px 16px;
                    border-radius: 6px;
                    overflow-x: auto;
                    color: #e2e8f0;
                }

                :deep(code) {
                    padding: 2px 6px;
                    border-radius: 4px;
                }

                :deep(pre > code) {
                    background: transparent;
                    padding: 0;
                }

                :deep(table) {
                    margin: auto;
                    border-collapse: collapse;
                }

                :deep(td, th) {
                    border: 1px solid #ccc;
                    padding: 6px 10px;
                }

                :deep(a) {
                    color: #409eff;
                    text-decoration: underline;
                }

                :deep(a:hover) {
                    color: #66b1ff;
                }


            }

            .actions {
                display: flex;
                justify-content: center;
                gap: 20px;
                margin-top: 20px;

                .action-text {
                    font-size: 15px;
                    line-height: 2.1;
                    margin-left: 8px;
                }

            }
        }

        .right {
            width: 30%;

            .sticky {
                position: sticky;
                top: 50px;
                align-self: flex-start;
                background-color: #fff;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                gap: 30px;
            }

            .header {
                .title {
                    font-size: 20px;
                    font-weight: 700;
                    color: #4e5969;
                }
            }

            .info {
                display: flex;
                flex-direction: column;
                gap: 15px;

                .text {
                    font-size: 15px;
                    line-height: 1.6;

                    .label {
                        color: #86909c;
                    }

                    .value {
                        color: #4e5969;
                        margin-left: 4px;
                    }
                }

                .reader {
                    margin-top: 10px;
                    font-size: 16px;
                    line-height: 1.6;
                    font-weight: bold;
                    color: #4e5969;
                    height: 200px;
                    overflow-y: auto;

                    :deep(.el-descriptions__body) {
                        margin-top: 12px;
                    }

                    :deep(.el-descriptions__content) {
                        display: flex;
                        align-items: center;
                        gap: 10px;

                        span {
                            cursor: pointer;

                            &:hover {
                                color: #3a4453;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
