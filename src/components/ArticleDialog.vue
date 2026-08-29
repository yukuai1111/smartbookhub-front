<template>
    <div class="article-dialog-container">
        <el-dialog :show-close="false" center style="padding:30px;text-align: center" v-model="articleStore.dialogShow"
            :title="articleStore.isEdit ? '编辑文章' : '新增文章'" :close-on-click-modal="false" align-center
            class="article-dialog" width="1000px">
            <template #default>
                <div class="article-form">
                    <el-form-item label="文章标题" prop="title">
                        <el-input v-model="article.title" type="text" maxlength="15" autocomplete="off"
                            placeholder="请输入文章标题" show-word-limit />
                    </el-form-item>
                    <el-form-item label="文章摘要" prop="summary">
                        <el-input v-model="article.summary" maxlength="100" placeholder="请输入文章摘要" show-word-limit
                            type="textarea" />
                    </el-form-item>
                    <el-form-item label="文章封面" prop="cover">
                        <ImageUpload :cover="props.cover" :actionDisabled="actionDisabled" @selectImg="selectImg"
                            @clearImg="clearImg" />
                    </el-form-item>
                    <el-form-item label="文章内容" prop="content">
                        <!-- 富文本编辑器 -->
                        <div class="editor-wrap">
                            <Toolbar :editor="editorRef!" :defaultConfig="toolbarConfig" />
                            <Editor v-model="article.content" :default-config="editorConfig"
                                @on-created="handleEditorCreated"/>
                        </div>
                    </el-form-item>
                </div>
            </template>
            <template #footer>
                <div class="dialog-footer">
                    <el-button :disabled="actionDisabled" size="large" @click="handleCancel">取消</el-button>
                    <el-button :loading="saveLoading" type="primary" size="large" @click="handleSave">
                        保存
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, shallowRef, onBeforeUnmount, watch } from 'vue'
import { useArticleStore } from '@/stores/articleStore'
import type { Article } from '@/interface/article'
import { ElMessage } from 'element-plus'
import { addArticle, updateArticle } from '@/api/articleApi'
import { Editor, Toolbar } from '@wangeditor-next/editor-for-vue'
import type { IDomEditor } from '@wangeditor-next/editor'
import '@wangeditor-next/editor/dist/css/style.css'
import { getPlainText } from '@/utils/getEditorText'
const editorRef = shallowRef<IDomEditor | null>(null)
const actionDisabled = ref<boolean>(false)
const selectCover = ref<File | null>(null)
// 富文本编辑器配置
const editorConfig = {
    placeholder: '请编写文章正文，支持加粗、列表等文本操作',
    MENU_CONF: {
    uploadImage: {
      server: import.meta.env.VITE_API_BASEURL+'/article/editor',
       fieldName: 'editor',
      headers: () => ({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }),
      showLoading: true,
      maxFileSize: 5 * 1024 * 1024,
      maxNumberOfFiles: 5,
      allowedFileTypes: ['image/*'],
      customInsert(res: any, insertImgFn: (src: string) => void) {
        const fullSrc = import.meta.env.VITE_IMG_BASEURL+ res.data.url
        insertImgFn(fullSrc)
      }
    }
  }
}
const toolbarConfig = {
    excludeKeys: [
        'group-video',
        'fullScreen'
    ]
}

// 初始化富文本编辑器
const handleEditorCreated = (editor: IDomEditor) => {
    editorRef.value = editor
}
const articleStore = useArticleStore()
const saveLoading = ref<boolean>(false)
const isDeleteCover = ref<boolean>(false)
const props = defineProps({
    articleCode: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        default: ''
    },
    summary: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        default: ''
    },
    cover: {
        type: String,
        default: ''
    }
})

const article = reactive<Article>({
    title: '',
    summary: '',
    content: ''
})
//判断数据是否改动
const hasChange = () => {
    const titleChange = article.title !== props.title
    const summaryChange = article.summary !== props.summary
    const contentChange = article.content !== props.content
    //图片改变
    //1.选中了新图片（selectCover不为null）
    //2.删除了图片（原本有图片，但现在没了）
    const coverChange = selectCover.value !== null || isDeleteCover.value
    return titleChange || summaryChange || contentChange || coverChange
}
//保存文章
const handleSave = async () => {
    if (article.title.trim() === '') {
        ElMessage.error('请输入文章标题')
        return
    }
    if (article.summary.trim() === '') {
        ElMessage.error('请输入文章摘要')
        return
    }
    if (!getPlainText(article.content).trim()) {
        ElMessage.error('请输入文章内容')
        return
    }
    let cover: File | null = selectCover.value
    actionDisabled.value = true
    saveLoading.value = true
    try {
        if (articleStore.isEdit) {
            //编辑
            //如果一个都没改，不需要调用接口直接说保存成功
            if (hasChange()) {
                console.log('有修改', article)
                article.articleCode = props.articleCode
                await updateArticle(article, cover)
                articleStore.isDetailRefresh = true
            }
            ElMessage.success(`编辑文章编码${props.articleCode}完成，可在文章中查看`)
        } else {
            //新增
            const res = await addArticle(article, cover)
            if (res.data) {
                ElMessage.success('保存新文章成功，文章编码为' + res.data.code + '，可在草稿箱中查看')
                articleStore.isListRefresh = true
                articleStore.isTotalRefresh = true
            }
        }
        articleStore.closeArticleDialog()
        reset()
    } catch (err) {
        if (err instanceof Error) {
            ElMessage.error(err.message)
        } else {
            ElMessage.error(err as string)
        }
    } finally {
        saveLoading.value = false
        actionDisabled.value = false
    }
}
//取消新增
const handleCancel = () => {
    articleStore.closeArticleDialog()
    reset()
}
//重置数据
const reset = () => {
    article.title = ''
    article.summary = ''
    article.content = ''
    article.articleCode = ''
    selectCover.value = null
    isDeleteCover.value = false
    actionDisabled.value = false
    saveLoading.value = false
}
//清空图片
const clearImg = () => {
    selectCover.value = null
    isDeleteCover.value = true
}
//图片选择
const selectImg = (file: File) => {
    selectCover.value = file
}
watch(() => articleStore.isEdit, () => {
    if (articleStore.isEdit) {
        article.title = props.title
        article.summary = props.summary
        article.content = props.content
    }
}, { immediate: true })
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor) {
        editor.destroy()
        editorRef.value = null
    }
})
</script>

<style scoped lang="scss">
.article-form {
    padding: 10px 40px;
    margin-top: 20px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 35px;

    .el-form-item {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        gap: 3px;
    }

    :deep(.el-form-item__label) {
        font-size: 15px;
    }

    .el-input {
        width: 800px;
        height: 50px;
        border-radius: 6px;
    }

    .el-textarea {
        width: 800px;
        border-radius: 6px;
    }

    .editor-wrap {
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        width: 100%;
    }

    :deep(.w-e-text-container) {
        height: 360px;
        overflow:visible !important;
    }

    :deep(.w-e-text-placeholder) {
        padding: 8px 12px;
    }
}
</style>
