<template>
    <div class="list-page">
        <div ref="scrollRef" style="height:6px;scroll-margin-top:90px;"></div>
        <FrontArticleList :articleList="articleList" />
        <el-pagination hide-on-single-page @change="handleChange" layout="prev, pager, next" :total="total"
            class="pagination" :pager-count="9" />
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { reactive, onMounted, ref, watch } from 'vue'
import { getProfileList } from '@/api/articleApi'
import type { GetArticleListRequest, ArticleInfo } from '@/interface/article'
import { statusMap } from '@/utils/statusMap'
import { useUserStore } from '@/stores/userStore'
import { useArticleStore } from '@/stores/articleStore'
import { ElMessage } from 'element-plus'
import { useScroll } from '@/hooks/useScroll'
const { scrollRef, scrollToTop } = useScroll()
const userStore = useUserStore()
const articleStore = useArticleStore()
const route = useRoute()
const data = reactive<GetArticleListRequest>({
    page: 1,
    pageSize: 10,
    status: null,
    authorId: userStore.userinfo?.userId
})
const articleList = ref<ArticleInfo[]>([])
const total = ref(0)
const getList = async () => {
    try {
        const res = await getProfileList(data)
        if (res.data) {
            articleList.value = res.data.articleList
            total.value = res.data.totalSize
        }
    } catch (err) {
        if (err instanceof Error) {
            ElMessage.error(err.message)
        } else {
            ElMessage.error(err as string)
        }
    }
}
//分页
const handleChange = async (val: number) => {
    data.page = val
    await getList()
    await scrollToTop()
}

//监听路由变化
watch(() => route.query.type, async (newVal) => {
    if (newVal) {
        //状态改变时，重置分页
        data.page = 1
        data.status = statusMap[newVal as string]
        await getList()
        await scrollToTop()
    }
},{immediate:true})
//监听是否可以刷新列表
watch(() => articleStore.isListRefresh, async (newVal) => {
    if (newVal) {
        await getList()
       articleStore.isListRefresh = false
    }
})
onMounted(() => {
    getList()
})
</script>

<style scoped lang="scss">
.pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>