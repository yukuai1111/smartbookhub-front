<template>
    <Header />
    <div class="other-page">
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
        <div class="content">
            <div class="content-item top">
                <div class="title">
                    用户主页
                </div>
                <div style="margin:0 auto" v-if="infoErrMsg">
                    <el-empty :description="infoErrMsg">
                        <el-button :loading="infoRetryLoading" type="primary" @click="otherInfo">重新获取</el-button>
                    </el-empty>
                </div>
                <div v-if="!infoErrMsg && otherUserInfo" class="userinfo">
                    <div class="avatar">
                        <el-image :preview-src-list="[imgBaseurl + otherUserInfo.avatar]" class="img"
                            :src="imgBaseurl + otherUserInfo.avatar" fit="cover" />
                    </div>
                    <div class="info-text">
                        <div class="text">
                            <div class="label">用户ID：</div>
                            <div class="value">{{ otherUserInfo.id }}</div>
                        </div>
                        <div class="text">
                            <div class="label">用户名：</div>
                            <div class="value">{{ otherUserInfo.username }}</div>
                        </div>
                        <div class="text">
                            <div class="label">用户昵称：</div>
                            <div class="value">{{ otherUserInfo.nickname }}</div>
                        </div>
                        <div class="text">
                            <div class="label">书龄：</div>
                            <div class="value">{{ formatYear(otherUserInfo.create_time) }}</div>
                        </div>
                        <div class="text">
                            <div class="label">签名：</div>
                            <div class="value">{{ otherUserInfo.signature ? otherUserInfo.signature : 'TA还没有留下任何痕迹...'
                            }}</div>
                        </div>
                    </div>

                </div>
            </div>
            <div class="content-item bottom" ref="scrollRef">
                <div class="title">
                    文章列表
                </div>
                <div style="margin:0 auto" v-if="articleErrMsg">
                    <el-empty :description="articleErrMsg">
                        <el-button :loading="articleRetryLoading" type="primary" @click="getList">重新获取</el-button>
                    </el-empty>
                </div>
                <div class="list" v-else>
                    <div style="margin:0 auto" v-if="articleList.length === 0">
                        <el-empty description="TA还没有发布任何文章...">
                        </el-empty>
                    </div>
                    <div @click="router.push({ name: 'articleDetail', query: { articleCode: item.code } })" v-else
                        v-for="item in articleList" :key="item.id" class="item">
                        <div class="cover">
                            <el-image :preview-src-list="[imgBaseurl + item.cover]" class="img"
                                :src="imgBaseurl + item.cover" fit="cover" />
                        </div>
                        <div class="item-info">
                            <div class="left">
                                <div class="item-title">{{ item.title }}({{ item.code }})</div>
                                <div class="item-summary">摘要：{{ item.summary }}</div>
                                <div class="item-time">发布时间：{{ formatTime(item.createTime) }}</div>
                            </div>
                            <div class="right">
                                <div class="item-readCount">阅读量：{{ item.read_count }}</div>
                            </div>
                        </div>

                    </div>
                </div>
                <el-pagination style="margin:0 auto" v-if="articleList.length > 0" 
                    @change="handlePageChange" background
                    layout="prev, pager, next" :total="total" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { getOtherUserInfo } from '@/api/userApi'
import { getProfileList } from '@/api/articleApi'
import type { ArticleInfo } from '@/interface/article'
import { formatYear, formatTime } from '@/utils/formatTime'
import type { UserInfo } from '@/interface/front'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { CaretLeft } from '@element-plus/icons-vue'
const imgBaseurl = import.meta.env.VITE_IMG_BASEURL
const infoErrMsg = ref('')
const infoRetryLoading = ref(false)
const articleErrMsg = ref('')
const articleRetryLoading = ref(false)
const route = useRoute()
const router = useRouter()
const otherUserId = computed(() => route.query.userId as string)
const otherUserInfo = ref<UserInfo>()
const articleList = ref<ArticleInfo[]>([])
const total = ref(0)
const scrollRef = ref<HTMLDivElement>()
const data = ref({
    page: 1,
    pageSize: 10,
    authorId: otherUserId.value
})
const otherInfo = async () => {
    if (infoErrMsg.value) {
        infoRetryLoading.value = true
    }
    try {
        const res = await getOtherUserInfo(otherUserId.value)
        otherUserInfo.value = res.data
        infoErrMsg.value = ''
    } catch (err) {
        infoErrMsg.value = '网络有误，请重试'
        if (err instanceof Error) {
            infoErrMsg.value = err.message
            ElMessage.error(err.message)
        } else {
            infoErrMsg.value = err as string
            ElMessage.error(err as string)
        }
    } finally {
        infoRetryLoading.value = false
    }
}
const getList = async () => {
    if (articleErrMsg.value) {
        articleRetryLoading.value = true
    }
    try {
        const res = await getProfileList(data.value)
        if (res.data) {
            articleList.value = []
            res.data.articleList.forEach(item => {
                if (item.status && item.status === 'published') {
                    articleList.value.push(item)
                } else {
                    articleList.value.push(item)
                }
            })
            total.value = res.data.totalSize
            articleErrMsg.value = ''
        }
    } catch (err) {
        articleErrMsg.value = '网络有误，请重试'
        if (err instanceof Error) {
            articleErrMsg.value = err.message
            ElMessage.error(err.message)
        } else {
            articleErrMsg.value = err as string
            ElMessage.error(err as string)
        }
    } finally {
        articleRetryLoading.value = false
    }
}
const handlePageChange = (val: number) => {
    data.value.page = val
    const dom=scrollRef.value
    if(dom){
        window.scrollTo({
            top: dom.offsetTop,
            behavior: 'smooth'
        })
    }
    getList()
}
onMounted(() => {
    otherInfo()
    getList()
})
</script>

<style scoped lang="scss">
.other-page {
    padding: 30px 160px;
    background-color: #f0f7ff;
    min-height: 100vh;
    width: 100%;
    overflow-x: hidden;

    .title {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 20px;
    }

    .nav {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        color: #86909c;
        cursor: pointer;
        margin-bottom: 20px;

        .nav-icon {
            margin-right: 4px;
        }

        .nav-text {
            font-size: 15px;
            font-weight: 700;
        }
    }

    .content {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 20px;

        .content-item {
            margin-top: 20px;
            padding: 30px;
            background-color: #fff;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            flex-direction: column;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
            width: 100%;

            &.top {

                .userinfo {
                    width: 100%;
                    padding: 10px;
                    display: flex;
                    align-items: flex-start;
                    gap: 50px;

                    .avatar {
                        width: 160px;
                        height: 160px;
                        overflow: hidden;
                        flex-shrink: 0;

                        .img {
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        }
                    }

                    .info-text {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-start;
                        align-items: flex-start;
                        gap: 25px;
                        min-width: 0;
                        overflow: hidden;

                        .text {
                            display: flex;
                            justify-content: flex-start;
                            align-items: center;
                            font-size: 18px;
                            gap: 20px;
                            width: 100%;

                            .label {
                                color: #333;
                                font-weight: 500;
                                white-space: nowrap;
                            }

                            .value {
                                color: #666;
                                font-size: 17px;
                                flex: 1;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }
                        }
                    }
                }
            }

            &.bottom {
                .list {
                    padding: 10px;
                    display: flex;
                    justify-content: flex-start;
                    align-items: flex-start;
                    flex-direction: column;
                    gap: 20px;
                    width: 100%;
                    overflow: hidden;

                    .title {
                        font-size: 24px;
                        font-weight: 700;
                        margin-bottom: 20px;
                    }

                    .item {

                        cursor: pointer;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
                        margin-bottom: 30px;
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        gap: 20px;
                        width: 100%;
                        padding: 16px;
                        border-radius: 8px;
                        transition: all 0.3s ease-in-out;
                        min-width: 0;
                        overflow: hidden;

                        &:hover {
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                        }

                        .cover {
                            width: 140px;
                            height: 120px;
                            overflow: hidden;
                            flex-shrink: 0;

                            .img {
                                width: 100%;
                                height: 100%;
                                object-fit: cover;
                            }
                        }

                        .item-info {
                            padding: 0 20px;
                            flex: 1;
                            display: flex;
                            justify-content: space-between;
                            align-items: flex-start;
                            width: 100%;
                            min-width: 0;
                            overflow: hidden;

                            .left {
                                flex: 1;
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                align-items: flex-start;
                                gap: 10px;
                                overflow: hidden;
                                min-width: 0;

                                .item-title {
                                    font-size: 18px;
                                    font-weight: 700;
                                    color: #333;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    width: 100%;
                                }

                                .item-summary {
                                    width: 100%;
                                    word-break: break-all;
                                    display: -webkit-box;
                                    -webkit-line-clamp: 2;
                                    -webkit-box-orient: vertical;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    color: #666;
                                }

                                .item-time {
                                    font-size: 13px;
                                    color: #999;
                                }
                            }

                            .right {
                                flex-shrink: 0;
                                padding-left: 20px;

                                .item-readCount {
                                    font-size: 14px;
                                    color: #666;
                                    white-space: nowrap;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
