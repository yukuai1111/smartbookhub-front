<template>
    <!-- 获取出错 -->
    <div v-if="errMsg">
        <el-empty :description="errMsg">
            <el-button :loading="retryLoading" type="primary" @click="getData">重新获取</el-button>
        </el-empty>
    </div>
    <div v-if="total && chart" class="card-container">
        <div class="cards">
            <el-row :gutter="20">
                <el-col :span="6" :xl="6">
                    <Card title="总用户数" :value="total.userCount" icon="1" v-bind="statColor.user" />
                </el-col>
                <el-col :span="6" :xl="6">
                    <Card title="总文章数" :value="total.articleCount" icon="2" v-bind="statColor.article" />
                </el-col>
                <el-col :span="6" :xl="6">
                    <Card title="上线文章数" :value="total.publishCount" icon="3" v-bind="statColor.publishArticle" />
                </el-col>
                <el-col :span="6" :xl="6">
                    <Card title="总评论数" :value="total.commentCount" icon="4" v-bind="statColor.comment" />
                </el-col>
            </el-row>

        </div>
        <el-row>
            <el-col :span="24">
                <div class="chart">
                    <EchartBar title="七日数据统计" name="新增量" :xdata="chart.dateList" :ydata1="chart.articleList"
                        :ydata2="chart.conversationList" />
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { StatisticsData, StatisticsChart } from '@/interface/back'
import { getStatisticsData, getStatisticsChart } from '@/api/adminApi'
import { useArticleStore } from '@/stores/articleStore'
const articleStore = useArticleStore()
const errMsg = ref('')
const retryLoading = ref(false)
//获取统计数据
const total = ref<StatisticsData>()
const getTotal = async () => {
    const res = await getStatisticsData()
    if (res.data) {
        total.value = res.data
    }
}
const statColor = {
    user: {
        bgColor: '#c8d5f2'   // 浅蓝，总用户数 保留
    },
    article: {
        bgColor: '#bfe2db'   // 浅青，总文章数 保留
    },
    publishArticle: {
        bgColor: '#e0d8f1'   // 暖调浅橙，上线文章数，同等深度，不再和用户蓝色接近
    },
    comment: {
        bgColor: '#ebc8d8'   // 浅粉，总评论数 保留
    }
}
//获取统计图表
const chart = ref<StatisticsChart>()
const getChart = async () => {
    const res = await getStatisticsChart()
    if (res.data) {
        chart.value = res.data
    }
}
const getData = async () => {
    if (errMsg.value) {
        retryLoading.value = true
    }
    try {
        await getTotal()
        await getChart()
        errMsg.value = ''
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
watch(() => articleStore.isTotalRefresh, async (newVal) => {
    if (newVal) {
        await getData()
        articleStore.isTotalRefresh = false
    }
})
onMounted(() => {
    getData()
})
</script>

<style scoped lang="scss">
.cards {
    .el-row {
        padding: 20px 40px
    }
}

.chart {
    margin-top: 20px;
    height: calc(100vh - 260px);
    width: 100%
}
</style>
