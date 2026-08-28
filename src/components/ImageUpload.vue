<template>
    <el-upload :disabled="!props.showAction" @change="fileChange" v-model:file-list="imageList" action="#"
        list-type="picture-card" :auto-upload="false" :limit="1" :class="{hide: imageList.length !== 0}">
       <template #trigger>
      <el-icon v-if="imageList.length === 0">
        <Plus />
      </el-icon>
    </template>
        <template #file="{ file }">
            <div>
                <el-image class="cover-image" :src="file.url" alt="图片" fit="cover" style="width:100%;height: 100%;" />
                <span v-if="props.showAction" class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-preview" v-if="!props.actionDisabled"
                        @click="handlePreview(file)">
                        <el-icon><zoom-in /></el-icon>
                    </span>
                    <span class="el-upload-list__item-delete" v-if="!props.actionDisabled" @click="handleDelete(file)">
                        <el-icon>
                            <Delete />
                        </el-icon>
                    </span>
                </span>
            </div>
        </template>

    </el-upload>

    <!-- 预览图片弹窗 -->
    <PreviewImg :previewVisible="previewVisible" :previewImageUrl="previewImageUrl" @close="previewVisible = false" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ZoomIn, Delete, Plus } from '@element-plus/icons-vue'
import type { UploadUserFile } from 'element-plus'
import { useArticleStore } from '@/stores/articleStore'
const articleStore = useArticleStore()
//图片列表
const imageList = ref<UploadUserFile[]>([])
const imageBaseurl = import.meta.env.VITE_IMG_BASEURL
const previewVisible = ref<boolean>(false)
const previewImageUrl = ref<string>('')
const props = defineProps({
    cover: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: ''
    },
    actionDisabled: {
        type: Boolean,
        default: false
    },
    showAction: {
        type: Boolean,
        default: true
    }
})
const emit = defineEmits<{
    (e: 'clearImg', value: string): void
    (e: 'selectImg', value: File): void
}>()
//预览图片
const handlePreview = (file: UploadUserFile) => {
    previewImageUrl.value = file.url!
    previewVisible.value = true
}
//删除图片
const handleDelete = (file: UploadUserFile) => {
    imageList.value = imageList.value.filter((item) => item !== file)
    emit('clearImg', '')
}
//图片修改
const fileChange = (file: UploadUserFile) => {
    if (file.raw) {
        emit('selectImg', file.raw)
    }
}
watch([() => props.cover, () => articleStore.isEdit], (newVal) => {
    if (newVal[0] && newVal[1]) {
        imageList.value = [{
            url: imageBaseurl + newVal[0],
            name: newVal[0],
            size: 0,
            raw: undefined,
        }]
    }
}, { immediate: true })
watch(() => props.avatar, (newVal) => {
    if (newVal) {
        imageList.value = [{
            url: imageBaseurl + newVal,
            name: newVal,
            size: 0,
            raw: undefined,
        }]
    }
}, { immediate: true })
</script>

<style scoped lang="scss">
.hide {
    :deep(.el-upload--picture-card) {
        display: none !important;
    }
}
</style>