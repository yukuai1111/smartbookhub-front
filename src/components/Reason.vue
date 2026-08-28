<template>
    <div>
        <el-dialog align-center @close="emit('close')"  :model-value="dialogVisible" title="确认" width="500" :close-on-click-modal="false">
            <el-form-item :label="`请输入${reasonMap[origin]}理由`" label-position="top">
                <el-input v-model="reason" clearable auto-complete="off"
                maxlength="100" type="textarea"  show-word-limit :rows="3" />
            </el-form-item>
            <template #footer>
                <div class="dialog-footer">
                    <el-button :disabled="!reason" :loading="props.btnLoading" type="primary" @click="handleConfirm">
                        确认
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps({
    dialogVisible: {
        type: Boolean,
        default: false,
    },
    origin: {
        type: String,
        default: '',
    },
    btnLoading: {
        type: Boolean,
        default: false,
    }
})
const emit = defineEmits(['close','confirm'])
const reasonMap: Record<string, string> = {
    offline: '下线',
    reject: '审核不通过'
}
const reason=ref<string>('')
//确认
const handleConfirm = () => {
    emit('confirm',reason.value)
    reason.value = ''
}
</script>

<style scoped></style>