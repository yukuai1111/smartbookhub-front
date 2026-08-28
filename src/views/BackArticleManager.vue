<template>
    <div>
         <div ref="scrollRef" style="height:6px;scroll-margin-top:90px;"></div>
        <AdminArticleList :articleList="articleList" />
        <el-pagination v-if="total > 0" @change="handleChange" layout="prev, pager, next" :total="total"
            class="pagination" :pager-count="9" />
    </div>
</template>

<script setup lang="ts">
import { ref,reactive, watch } from 'vue'
import { getArticleList } from '@/api/articleApi'
import type { GetArticleListRequest, ArticleInfo } from '@/interface/article'
import { useRoute } from 'vue-router'
import { useArticleStore } from '@/stores/articleStore'
const articleStore = useArticleStore()
const route = useRoute()
import { statusMap } from '@/utils/statusMap'
import { useScroll } from '@/hooks/useScroll'
const { scrollRef, scrollToTop } = useScroll()
const articleData = reactive<GetArticleListRequest>({
    page: 1,
    pageSize: 10,
    status: null,
    onlySelf: null,
})
const articleList = ref<ArticleInfo[]>([])
const total = ref<number>(0)
//获取文章列表
const getList = async () => {
    const res = await getArticleList(articleData)
    if (res.data) {
        articleList.value = res.data.articleList
        total.value = res.data.totalSize
    }
}
watch(() => route.query, async (newVal) => {
    if (newVal) {
        //状态改变时，重置分页
        articleData.page = 1
        articleData.status = statusMap[newVal.type as string]
        //是否只显示自己的文章
        articleData.onlySelf = newVal.onlySelf === 'false' ? false : null
        await getList()
        await scrollToTop()
    }
}, { immediate: true })
//监听是否可以刷新文章列表
watch(() => articleStore.isListRefresh, async (newVal) => {
    if (newVal) {
        await getList()
        articleStore.isListRefresh = false
    }
})
//分页
const handleChange = async (val: number) => {
    articleData.page = val
    await getList()
    await scrollToTop()
}
</script>

<style scoped lang="scss">
.pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>