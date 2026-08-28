<template>
    <div>
        <el-dialog :model-value="previewVisible" @close="emit('close')">
            <el-image style="margin-top:20px" :src="previewImageUrl" alt="Preview Image" fit="contain" />
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    previewVisible: {
        type: Boolean,
        default:false,
    },
    previewImageUrl: {
        type: String,
        default: '',
    }
})
const emit = defineEmits(['close'])
</script>

<style scoped></style>