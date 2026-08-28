// 文章管理状态管理
import { defineStore } from 'pinia'
import { ref,computed } from 'vue'
export const useArticleStore = defineStore('article', () => {
    //文章弹窗
    const articleDialogVisible = ref<boolean>(false)
    //打开弹窗的模式（front/admin）
    const articleDialogMode = ref<'front' | 'admin'>('front')
    //是否是编辑
    const isEditMode = ref<boolean>(false)
    //是否刷新文章列表
    const isListRefresh = ref<boolean>(false)
    //是否刷新文章详情
    const isDetailRefresh = ref<boolean>(false)
    //是否刷新文章统计
    const isTotalRefresh = ref<boolean>(false)
    //打开弹窗（新增）
    const openAddArticleDialog = (mode: 'front' | 'admin') => {
        articleDialogVisible.value = true
        articleDialogMode.value = mode
        isEditMode.value = false
    }
    //打开弹窗（编辑）
    const openEditArticleDialog = (mode: 'front' | 'admin') => {
        articleDialogVisible.value = true
        articleDialogMode.value = mode
        isEditMode.value = true
    }
    //关闭弹窗
    const closeArticleDialog = () => {
        articleDialogVisible.value = false
        isEditMode.value = false
    }
    const dialogShow = computed(() => articleDialogVisible.value)
    const dialogMode = computed(() => articleDialogMode.value)
    const isEdit = computed(() => isEditMode.value)
    return {
        dialogShow,
        dialogMode,
        isEdit,
        isListRefresh,
        isDetailRefresh,
        isTotalRefresh,
        openAddArticleDialog,
        openEditArticleDialog,
        closeArticleDialog,
    }
})
