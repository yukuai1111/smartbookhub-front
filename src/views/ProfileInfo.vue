<template>
    <div class="info-page">
        <div class="header">
            个人中心
        </div>
        <!-- 出错 -->
        <div v-if="errMsg" class="error">
            <el-empty :description="errMsg">
                <el-button :loading="retryLoading" type="primary" @click="getInfo">重新获取</el-button>
            </el-empty>
        </div>
        <div class="content" v-if="changeUserInfo && originalUserInfo && !errMsg">
            <div class="form">
                <el-form-item label="头像">
                    <ImageUpload :avatar="avatarurl" :showAction="editData" @clearImg="clearImg"
                        @selectImg="selectImg" />
                </el-form-item>
                <el-form-item label="用户ID">
                    <el-input :value="originalUserInfo.id" disabled />
                </el-form-item>
                <el-form-item label="用户名">
                    <el-input :value="originalUserInfo.username" disabled />
                </el-form-item>
                <el-form-item label="书龄">
                    <el-input :value="formatYear(originalUserInfo.create_time)" disabled />
                </el-form-item>
                <el-form-item label="昵称" label-position="top">
                    <el-input type="text" v-model="changeUserInfo.nickname" :disabled="!editData" />
                </el-form-item>
                <el-form-item label="手机号" label-position="top">
                    <el-input type="tel" v-model="changeUserInfo.phone" :disabled="!editData" />
                </el-form-item>

                <el-form-item label="个人签名" label-position="top">
                    <el-input type="textarea" maxlength="100" show-word-limit clearable resize="none" :rows="5"
                        v-model="changeUserInfo.signature" :disabled="!editData" placeholder="快来介绍一下自己吧~" />
                </el-form-item>
            </div>
            <div class="btns">
                <div class="group">
                    <el-button size="large" :loading="btnLoading" :disabled="btnLoading" type="primary" v-if="!editData"
                        @click="handleEdit">编辑资料</el-button>
                    <el-button size="large" :loading="btnLoading" :disabled="btnLoading" type="primary" v-else
                        @click="handleSubmit()">保存修改</el-button>
                    <el-button size="large" :loading="btnLoading" :disabled="btnLoading" type="info"
                        @click="handleCancel" v-if="editData">取消编辑</el-button>
                </div>
                <el-divider content-position="center">
                    <h4 class="safe">账号安全</h4>
                </el-divider>
                <div class="group">
                    <el-button size="large" :loading="btnLoading" :disabled="btnLoading" type="warning"
                        @click="changeDialog = true">修改密码</el-button>
                </div>
                <el-divider content-position="center">
                    <h4 class="danger">危险操作</h4>
                </el-divider>
                <div class="group">
                    <el-button size="large" :loading="btnLoading" :disabled="btnLoading" type="danger"
                        @click="handleRemove">注销账号</el-button>
                </div>
            </div>

            <el-dialog v-model="changeDialog" title="修改密码" width="500" center>
                <div class="dialog-content">
                    <el-form>
                        <el-form-item label="旧密码" prop="oldPassword">
                            <el-input type="password" show-password v-model="changePasswordForm.oldPassword"
                                placeholder="请输入旧密码" autocomplete="current-password" />
                        </el-form-item>
                        <el-form-item label="新密码" prop="newPassword">
                            <el-input type="password" show-password v-model="changePasswordForm.newPassword"
                                placeholder="请输入新密码" autocomplete="new-password" />
                        </el-form-item>
                        <el-form-item label="确认新密码" prop="confirmPassword">
                            <el-input type="password" show-password v-model="changePasswordForm.confirmPassword"
                                placeholder="请确认新密码" autocomplete="new-password" />
                        </el-form-item>
                    </el-form>
                </div>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="changeDialog = false">取消</el-button>
                        <el-button type="primary" @click="handleChangePsd">
                            确定修改
                        </el-button>
                    </div>
                </template>
            </el-dialog>
        </div>
    </div>


</template>

<script setup lang="ts">
import { ref, onMounted, watch, reactive } from 'vue'
import { getUserInfo, updateUser, changePassword, deleteUser } from '@/api/frontApi'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UserInfo, ChangePassword, ChangeUserInfo } from '@/interface/front'
import { formatYear } from '@/utils/formatTime'
import { useUserStore } from '@/stores/userStore'
import { useAiStore } from '@/stores/aiStore'
import { useArticleStore } from '@/stores/articleStore'
import router from '@/router'
const userStore = useUserStore()
const aiStore = useAiStore()
const articleStore = useArticleStore()
const btnLoading = ref<boolean>(false)
const originalUserInfo = ref<UserInfo>()
const avatarurl = ref<string>('')
const avatar = ref<File | null>(null)
const deleteAvatar = ref<boolean>(false)
const errMsg = ref<string>('')
const retryLoading = ref<boolean>(false)
const changeUserInfo = reactive<ChangeUserInfo>({
    nickname: '',
    phone: '',
    signature: ''
})
const changePasswordForm = ref<ChangePassword>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
})
const changeDialog = ref<boolean>(false)
//是否可以修改资料
const editData = ref<boolean>(false)

const getInfo = async () => {
    if (errMsg.value) {
        retryLoading.value = true
    }
    try {
        const res = await getUserInfo()
        if (res.data) {
            originalUserInfo.value = res.data.userinfo
            errMsg.value = ''
        }
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
const handleEdit = () => {
    editData.value = true
}
const hasChange = () => {
    const nickChange = changeUserInfo.nickname !== originalUserInfo.value?.nickname
    const phoneChange = changeUserInfo.phone !== originalUserInfo.value?.phone
    const signatureChange = changeUserInfo.signature !== originalUserInfo.value?.signature
    const avatarChange = avatarurl.value === '' || deleteAvatar.value
    return nickChange || phoneChange || signatureChange || avatarChange
}
const handleSubmit = async () => {
    try {
        btnLoading.value = true
        if (hasChange()) {
            const res = await updateUser(changeUserInfo, avatar.value || undefined)
            if (res.data) {
                avatarurl.value = res.data.avatar
                userStore.updateUserInfo({
                    userId: res.data.userId,
                    avatar: avatarurl.value,
                    nickname: changeUserInfo.nickname,
                    userType: 0,
                })
            }
            await getInfo()
        } else {
            avatarurl.value = originalUserInfo.value!.avatar
        }
        ElMessage.success('修改成功')
        editData.value = false
    } catch (err) {
        if (err instanceof Error) {
            ElMessage.error(err.message)
        } else {
            ElMessage.error(err as string)
        }
    } finally {
        btnLoading.value = false
    }
}
const handleCancel = () => {
    editData.value = false
    //复原用户信息
    if (originalUserInfo.value) {
        avatarurl.value = originalUserInfo.value.avatar
        changeUserInfo.nickname = originalUserInfo.value.nickname
        changeUserInfo.phone = originalUserInfo.value.phone
        changeUserInfo.signature = originalUserInfo.value.signature
    }
}
const clearImg = () => {
    avatarurl.value = ''
    deleteAvatar.value = true
}
const selectImg = (file: File) => {
    avatar.value = file
}
const handleChangePsd = async () => {
    let oldPassword = changePasswordForm.value.oldPassword.trim()
    let newPassword = changePasswordForm.value.newPassword.trim()
    let confirmPassword = changePasswordForm.value.confirmPassword.trim()
    if (oldPassword === '') {
        ElMessage.error('请输入旧密码')
        return
    }
    if (newPassword === '') {
        ElMessage.error('请输入新密码')
        return
    }
    if (confirmPassword === '') {
        ElMessage.error('请输入确认新密码')
        return
    }
    if (newPassword !== confirmPassword) {
        ElMessage.error('两次输入密码不一致')
        confirmPassword = ''
        return
    }
    if (newPassword.length < 6 || newPassword.length > 12) {
        ElMessage.error('新密码长度不能小于6位或大于12位')
        newPassword = ''
        return
    }
    if (oldPassword.length < 6 || oldPassword.length > 12) {
        ElMessage.error('旧密码长度不能小于6位或大于12位')
        oldPassword = ''
        return
    }
    if (confirmPassword.length < 6 || confirmPassword.length > 12) {
        ElMessage.error('确认密码长度不能小于6位或大于12位')
        confirmPassword = ''
        return
    }
    try {
        await changePassword(changePasswordForm.value)
        changeDialog.value = false
        //退出登录
        userStore.clearUserInfo()
        await router.push({ name: 'logReg', query: { type: 'login' } })
        ElMessage.success('修改成功，请重新登录')
    } catch (err) {
        if (err instanceof Error) {
            ElMessage.error(err.message)
        } else {
            ElMessage.error(err as string)
        }
    }
}

const handleRemove = () => {
    ElMessageBox.confirm('确定注销账号吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        try {
            await deleteUser()
            if (aiStore.currentControllerKey) {
                //注销账号清除控制器
                aiStore.removeOneController(aiStore.currentControllerKey as string, true)
                ElMessage.warning('会话已中断')
            }
            articleStore.isTotalRefresh=true
            userStore.clearUserInfo()
            await router.push({ name: 'home' })
            ElMessage.success('注销账号成功')
        } catch (err) {
            if (err instanceof Error) {
                ElMessage.error(err.message)
            } else {
                ElMessage.error(err as string)
            }
        }
    })
}

watch(() => originalUserInfo.value, (newVal) => {
    if (newVal) {
        avatarurl.value = newVal.avatar
        changeUserInfo.nickname = newVal.nickname
        changeUserInfo.phone = newVal.phone
        changeUserInfo.signature = newVal.signature
    }
})
onMounted(async () => {
    await getInfo()
})
</script>

<style scoped lang="scss">
.info-page {
    padding: 30px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;

    .header {
        font-size: 22px;
        font-weight: 600;
        color: #303133;
        margin: 0 0 24px 0;
    }

    .content {
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;

        .form {
            width: 100%;

            .el-form-item {
                margin-bottom: 30px;
                width: 48%;

                :deep(.el-form-item__label) {
                    font-weight: 600;
                    margin-right: 10px;
                    color: #44464a;
                }

                :deep(.el-form-item__content) {
                    padding: 4px;

                    .hide {
                        margin-left: 20px;
                    }

                    input {
                        height: 40px;
                        font-size: 16px;

                    }

                    .el-input__wrapper {
                        border-radius: 10px;
                    }

                    :deep(.el-input__inner) {
                        padding: 30px;
                        font-size: 16px;
                    }

                    .el-textarea {
                        border-radius: 10px;
                        width: 80%;
                        font-size: 16px;
                    }
                }
            }

        }

        .btns {
            margin-top: 20px;
            display: flex;
            align-items: flex-start;
            flex-direction: column;
            justify-content: center;
            margin-left: 40px;
            width: 100%;
            gap: 20px;

            .group {
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                gap: 20px;

                .el-button {
                    width: 100%;
                    font-size: 16px;
                }
            }

            .el-divider {
                margin-bottom: 20px;

                :deep(.el-divider__text) {
                    background-color: transparent;

                    .safe {
                        font-size: 16px;
                        font-weight: 500;
                        color: #3b6ea8;
                    }

                    .danger {
                        font-size: 16px;
                        font-weight: 500;
                        color: #e53935;
                    }
                }
            }
        }

        .dialog-content {
            width: 100%;
            padding: 30px;
        }
    }

    .error {
        margin-top: 20px;
        margin-left: auto;
        margin-right: auto;
        width: 80%;
        text-align: center;
    }
}
</style>
