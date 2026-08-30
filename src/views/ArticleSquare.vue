<template>
    <div class="article-page">
        <Header  />
        <div class="article-content">
            <div ref="scrollRef" style="height:6px;scroll-margin-top:200px;"></div>
            <!-- 获取出错 -->
            <div v-if="errMsg" style="margin:auto"> 
                <el-empty :description="errMsg">
                    <el-button :loading="retryLoading" type="primary" @click="getArticle">重新获取</el-button>
                </el-empty>
            </div>
            <div class="left" v-if="!errMsg">
                <div class="header">猜你喜欢</div>
                <div v-if="recommendList && recommendList.length === 0">
                    <el-empty description="暂无推荐文章">
                    </el-empty>
                </div>
                <div class="list" v-if="recommendList.length > 0">
                    <div class="item" @click="goDetail(item.code)" v-for="item in recommendList" :key="item.id">
                        <div class="cover">
                            <el-image  class="cover-img" :src="coverBaseUrl + item.cover" fit="fill" />
                        </div>
                        <div class="info">
                            <div class="title">{{ item.title }}</div>
                            <div class="author">{{ item.author }}</div>
                            <div class="time">
                                发布时间：{{ dayjs(item.createTime).format('YYYY-MM-DD') }}
                            </div>
                            <div class="read-count">
                                阅读量：{{ item.read_count }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="right" v-if="!errMsg">
                <div class="header">最新文章</div>
                <div v-if="articleList && articleList.length === 0">
                    <el-empty description="暂无文章">
                    </el-empty>
                </div>
                <div class="list" v-if="articleList.length > 0">
                    <div class="item" @click="goDetail(item.code)" v-for="item in articleList" :key="item.id">
                        <div class="cover">
                            <el-image class="cover-img" :src="coverBaseUrl + item.cover" fit="fill" />
                        </div>
                        <div class="info">
                            <div class="title">{{ item.title }}</div>
                            <div class="author">{{ item.author }}</div>
                            <div class="time">
                                <span>发布时间：{{ dayjs(item.createTime).format('YYYY-MM-DD') }}</span>
                                <span>更新时间：{{ formatTime(item.updateTime) }}</span>
                            </div>
                            <div class="read-count">
                                阅读量：{{ item.read_count }}
                            </div>
                        </div>
                    </div>
                </div>
                <el-pagination v-if="articleList.length > 0" @change="handlePageChange" class="pagination" background
                    layout="prev, pager, next" :total="total" hide-on-single-page/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getRecommendList, getProfileList } from '@/api/articleApi'
import { dayjs, ElMessage } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import type { Recomment, ArticleInfo } from '@/interface/article'
import { formatTime } from '@/utils/formatTime'
import { useScroll } from '@/hooks/useScroll'
import { useRouter } from 'vue-router'
const router = useRouter()
const { scrollRef, scrollToTop } = useScroll()

const recommendList = ref<Recomment[]>([])
const articleList = ref<ArticleInfo[]>([])
const errMsg = ref('')
const retryLoading = ref(false)
const coverBaseUrl = import.meta.env.VITE_IMG_BASEURL
const total = ref(0)
const pageData = reactive({
    page: 1,
    pageSize: 10,
})
const getCommend = async () => {
    const res = await getRecommendList()
    if (res.data) {
        recommendList.value = res.data.recommendList
    }
}

const getList = async () => {
    const res = await getProfileList(pageData)
    if (res.data) {
        total.value = res.data.totalSize
        articleList.value = res.data.articleList
    }
}
const getArticle = async () => {
    if (errMsg.value) {
        retryLoading.value = true
    }
    try {
        await getList()
        await getCommend()
        errMsg.value = ''
    } catch (err) {
        errMsg.value = '网络有误，请稍后重试'
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
const handlePageChange = async (val: number) => {
    pageData.page = val
    await getList()
    await scrollToTop()
}
const goDetail = (code: string) => {
    router.push({
        name: 'articleDetail',
        query: {
            articleCode: code
        }
    })
}
onMounted(async () => {
    await getArticle()
})
</script>

<style scoped lang="scss">
.article-page {
    min-height: 100vh;

    .article-content {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 20px;
        padding: 20px
    }

    .header {
        font-size: 20px;
        font-weight: bold;
        padding: 20px 20px 12px 20px;
        color: #1f2937;
        margin-bottom: 30px;
    }

    .item {
        background-color: #fff;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 20px;
        padding: 20px;
        margin-bottom: 20px;
        cursor: pointer;

        &:last-child {
            margin-bottom: 0;
        }
        .info {
            min-width: 0;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            gap: 10px;

            .title {
                font-size: 16px;
                font-weight: bold;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: #2c333f
            }

            .author {
                font-size: 13px;
                color: #888;
                white-space: nowrap;
            }

            .time {
                display: flex;
                align-items: flex-start;
                flex-direction: column;
                justify-content: flex-start;
                gap: 8px;
                font-size: 13px;
                color: #888;

            }

            .read-count {
                font-size: 13px;
                color: #888;
            }
        }
    }


    .left {
        padding: 10px;
        width: 30%;
        background-color: #f7f9fc;
        border-radius: 10px;

        .list {
            margin-top: 20px;
            .item {
                border-top: 3px solid #5489c7;

                &:hover {
                    transform: scale(1.02);
                    transition: all 0.2s ease-in-out;
                    background-color: #edf2f8;
                    box-shadow: 0 2px 8px rgba(40, 70, 120, 0.08);
                    border-color: #d1dceb;
                }

                .cover {
                    width: 100px;
                    height: 100px;
                    border-radius: 10px;
                    overflow: hidden;

                    .cover-img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }
            }
        }
    }

    .right {
        background-color: #f8fafb;
        padding: 10px;
        width: 70%;
        border-radius: 10px;

        .pagination {
            margin-top: 20px;
            padding-left: 43%;
        }

        .list {
            margin-top: 20px;

            .item {
                border-top: 3px solid #e4e9f0;

                &:hover {
                    background-color: #f0f4f7;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                    border-color: #d8e0e8;
                }

                .cover {
                    width: 150px;
                    height: 150px;
                    border-radius: 10px;
                    overflow: hidden;

                    .cover-img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }
            }
        }
    }
}
</style>
