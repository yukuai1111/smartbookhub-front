<template>
    <div class="list-page">
        <el-table class="admin-article-table" :data="articleList" style="width: 100%;" fit size="large"
            empty-text="暂无文章">
            <el-table-column align="center" fixed prop="code" label="文章编码" width="200" show-overflow-tooltip />
            <el-table-column align="center" prop="cover" label="封面" width="150">
                <template #default="{ row }">
                    <el-image style="width: 150px;height: 120px;object-fit: cover" @click="handlePreview(row.cover)" :src="coverBaseUrl + row.cover"/>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="title" label="文章标题" width="120" show-overflow-tooltip />
            <el-table-column align="center" prop="summary" label="摘要" width="160" show-overflow-tooltip />
            <el-table-column align="center" prop="author" label="作者" width="120" show-overflow-tooltip />
            <el-table-column label="状态" width="110">
                <template #default="{ row }">
                    <el-tag :type="statusColorMap[row.status]">{{ statusNameMap[row.status] }}</el-tag>
                </template>
            </el-table-column>

            <el-table-column align="center" prop="read_count" label="阅读量" width="120" />

            <el-table-column align="center" prop="createTime" label="创建时间" width="160">
                <template #default="{ row }">
                    {{ dayjs(row.createTime).format('YYYY-MM-DD HH:mm') }}
                </template>
            </el-table-column>
            <el-table-column align="center" prop="updateTime" label="上一次更新时间" width="160">
                <template #default="{ row }">
                   {{ dayjs(row.updateTime).format('YYYY-MM-DD HH:mm') }}
                </template>
            </el-table-column>
            <el-table-column  align="center" prop="offline_reason" label="下线原因" width="160" show-overflow-tooltip>
                <template #default="{ row }">
                    <span v-if="row.offline_reason">{{ row.offline_reason }}</span>
                </template>
            </el-table-column>
            <el-table-column  align="center" prop="offlineTime" label="下线时间" width="160" show-overflow-tooltip>
                <template #default="{ row }">
                    <span v-if="row.offlineTime">{{ dayjs(row.offlineTime).format('YYYY-MM-DD HH:mm') }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="reject_reason" label="驳回原因" width="160" show-overflow-tooltip>
                <template #default="{ row }">
                    <span v-if="row.reject_reason">{{ row.reject_reason }}</span>
                </template>
            </el-table-column>
            <el-table-column  align="center" prop="rejectTime" label="驳回时间" width="160" show-overflow-tooltip>
                <template #default="{ row }">
                    <span v-if="row.rejectTime">{{ dayjs(row.rejectTime).format('YYYY-MM-DD HH:mm') }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" fixed="right" label="操作" min-width="200">
                <template #default="{ row }">
                    <!-- 查看：查看自己所有的文章 -->
                    <el-button type="primary" link style="margin-left:8px"
                        @click="handleDetail(row.code)">查看</el-button>

                    <!--下线：可以下线所有已发布文章 -->
                    <el-button @click="handleOffline(row.code)" :loading="btnLoading" :disabled="btnLoading === true"
                        link type="warning" style="margin-left:8px" v-if="row.status === 'published'">下线</el-button>

                    <!--发布：发布草稿/已下线的文章 -->
                    <el-button :loading="btnLoading" :disabled="btnLoading === true" link type="success"
                        style="margin-left:8px" @click="handlePublish(row.code)"
                        v-if="row.status === 'offline' || row.status === 'draft'">提交审核</el-button>

                    <!--删除：只有自己才可以删除草稿、已下线的文章 -->
                    <el-button :loading="btnLoading" :disabled="btnLoading === true" link type="danger"
                        style="margin-left:8px" @click="handleDelete(row.code)"
                        v-if="row.status === 'draft' || row.status === 'offline'">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 图片预览弹窗 -->
        <PreviewImg :previewVisible="previewVisible" :previewImageUrl="previewImageUrl"
            @close="previewVisible = false" />
    </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import type { ArticleInfo } from '@/interface/article'
import dayjs from 'dayjs'
import { statusColorMap, statusNameMap } from '@/utils/statusMap'
import { useRouter } from 'vue-router'
import { deleteArticle, publishArticle, offlineArticle } from '@/api/articleApi'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useArticleStore } from '@/stores/articleStore'
const articleStore = useArticleStore()
const router = useRouter()
const props = defineProps({
    articleList: {
        type: Array as () => ArticleInfo[],
        default: () => [],
    }
})
//预览封面弹窗
const previewVisible = ref<boolean>(false)
//预览封面图片
const previewImageUrl = ref<string>('')
const coverBaseUrl = import.meta.env.VITE_IMG_BASEURL
const btnLoading = ref<boolean>(false)
//预览封面
const handlePreview = (cover: string) => {
    previewImageUrl.value = coverBaseUrl + cover
    previewVisible.value = true
}
//查看文章
const handleDetail = (articleCode: string) => {
    router.push({
        name: 'articleDetail',
        query:
        {
            articleCode
        }
    })
}
//删除文章
const handleDelete = (articleCode: string) => {
    ElMessageBox.confirm('确认删除该文章吗，删除后无法恢复', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        try {
            btnLoading.value = true
            const res = await deleteArticle(articleCode)
            if (res.data) {
                ElMessage.success(`成功删除编码为${res.data.code}的文章`)
                //刷新页面
                articleStore.isListRefresh = true
                articleStore.isTotalRefresh = true
            }
        } catch (error) {
            if (error instanceof Error) {
                ElMessage.error(error.message || '删除失败')
            } else {
                ElMessage.error(error as string)
            }
        } finally {
            btnLoading.value = false
        }
    }).catch(() => {
        ElMessage.info('取消删除')
    })

}
//发布文章
const handlePublish = async (articleCode: string) => {
    try {
        const res = await publishArticle(articleCode)
        if (res.data) {
            ElMessage.success(`成功提交编码为${res.data.code}的文章，请等待审核~`)
            //刷新页面
            articleStore.isListRefresh = true
            articleStore.isTotalRefresh=true
        }
    } catch (error) {
        if (error instanceof Error) {
            ElMessage.error(error.message || '发布失败')
        } else {
            ElMessage.error(error as string)
        }
    } finally {
        btnLoading.value = false
    }
}
//下线文章
const handleOffline = async (articleCode: string) => {
    ElMessageBox.confirm('确认下线该文章吗', '下线确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        try {
            btnLoading.value = true
            const res = await offlineArticle(articleCode)
            if (res.data) {
                ElMessage.success(`成功下线编码为${res.data.code}的文章`)
                //刷新页面
                articleStore.isListRefresh = true
                articleStore.isTotalRefresh=true
            }
        } catch (error) {
            if (error instanceof Error) {
                ElMessage.error(error.message || '下线失败')
            } else {
                ElMessage.error(error as string)
            }
        } finally {
            btnLoading.value = false
        }
    }).catch(() => {
        ElMessage.info('取消下线')
    })
}
</script>

<style scoped lang="scss">
.list-page {
    padding: 10px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    :deep(.el-table__header-wrapper .cell) {
        color: #606266;
        font-weight: bold;
        font-size: 17px;
    }

    :deep(.admin-article-table .el-table__body tr:nth-child(odd)) {
        background-color: #f8fbff;
    }
}
</style>