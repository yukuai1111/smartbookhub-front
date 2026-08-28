<template>
    <div class="logReg-page">
        <div class="left"></div>
        <div class="right">
            <div class="back-btn" @click="router.back()">
                <el-icon size="20">
                    <ArrowLeftBold />
                </el-icon>
                <span class="back-btn-text">返回</span>
            </div>
            <div class="form">
                <div class="form-header">
                    {{ type === 'login' ? '登录' : '注册' }}
                </div>
                <el-form class="form-content" ref="ruleFormRef" :model="formData" status-icon :rules="formRules"
                    label-position="right" label-width="auto">
                    <el-form-item label="账号" prop="account" v-if="type === 'login'">
                        <el-input v-model="formData.account" type="text" autocomplete="off" placeholder="请输入用户名或手机号"
                            :disabled="btnLoading" />
                    </el-form-item>
                    <el-form-item label="用户名" prop="username" v-if="type === 'register'">
                        <el-input v-model="formData.username" type="text" autocomplete="off" placeholder="请输入用户名"
                            :disabled="btnLoading" />
                    </el-form-item>
                    <el-form-item label="手机号" prop="phone" v-if="type === 'register'">
                        <el-input v-model="formData.phone" type="tel" autocomplete="off" placeholder="请输入手机号"
                            :disabled="btnLoading" />
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input show-password v-model="formData.password" type="password" autocomplete="off" placeholder="请输入密码"
                            :disabled="btnLoading" />
                    </el-form-item>
                    <el-form-item label="确认密码" prop="confirmPassword" v-if="type === 'register'">
                        <el-input v-model="formData.confirmPassword" type="password" autocomplete="off"
                            placeholder="请确认密码" :disabled="btnLoading" />
                    </el-form-item>

                    <div class="tip" @click="handleChangeType">
                        <span>{{ type === 'login' ? '还没有账号？去注册' : '已有账号？去登录' }}</span>
                    </div>
                    <el-form-item>
                        <el-button @keyup.enter="submitForm(ruleFormRef)" :loading="btnLoading" size="large" round
                            @click="submitForm(ruleFormRef)">
                            {{ type === 'login' ? '登录' : '注册' }}
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="tip-text">
                遇到问题请联系管理员:3181008805@qq.com
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeftBold } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { loginRegisterForm } from '@/interface/user'
import { register, login } from '@/api/logregApi'
import { useUserStore } from '@/stores/userStore'
import { useArticleStore } from '@/stores/articleStore'
import { ElMessage } from 'element-plus'


const userStore = useUserStore()
const articleStore = useArticleStore()
//登录注册按钮loading状态
const btnLoading = ref<boolean>(false)

const route = useRoute()
const router = useRouter()
const type = ref<string>('')
//表单数据
const formData = reactive<loginRegisterForm>({
    account: '',
    password: '',
    username: '',
    phone: '',
    confirmPassword: '',
})

const ruleFormRef = ref<FormInstance>()
//校验登录规则
const formRules = reactive<FormRules<loginRegisterForm>>({
    //校验账号
    account: [
        { required: true, message: '请输入账号', trigger: 'input' },
        { min: 1, max: 15, message: '账号长度必须在1-15个字符之间', trigger: 'input' },
    ],
    //校验密码
    password: [
        { required: true, message: '请输入密码', trigger: 'input' },
        { min: 6, max: 15, message: '密码长度必须在6-15个字符之间', trigger: 'input' },
    ],
    //校验用户名
    username: [
        { required: true, message: '请输入用户名', trigger: 'input' },
        { min: 1, max: 15, message: '用户名长度必须在1-15个字符之间', trigger: 'input' },
    ],
    //校验手机号
    phone: [
        { required: true, message: '请输入手机号', trigger: 'input' },
        { min: 11, max: 11, message: '手机号长度必须为11位', trigger: 'input' },
        {
            validator: (_, value, callback) => {
                const reg = /1[3456789]\d{9}/
                if (!reg.test(value)) {
                    callback(new Error('请输入正确的手机号'))
                } else {
                    callback()
                }
            }
        },
    ],
    //校验确认密码
    confirmPassword: [
        { required: true, message: '请确认密码', trigger: 'input' },
        { min: 6, max: 15, message: '确认密码长度必须在6-15个字符之间', trigger: 'input' }, {
            validator: (_, value, callback) => {
                if (formData.password && formData.password !== value) {
                    callback(new Error('两次密码输入不一致'))
                } else {
                    callback()
                }
            }
        }
    ],
})
//登录
const loginUser = async (isRegister: boolean = false) => {
    try {
        const res = await login({ account: formData.account, password: formData.password })
        ElMessage.success(res.message)
        if (res.data) {
            //存用户信息
            userStore.setUserInfo(res.data.userInfo, res.data.token)
            //管理员：跳后台
            //普通用户：跳首页
            if (res.data.userInfo.userType === 1) {
                router.push({ name: 'backLayout' })
            } else {
                router.push({ name: 'home' })
            }
        }
    } catch (err) {
        if (isRegister) {
            ElMessage.error('自动登陆失败，请手动登录')
            return
        }
        if (err instanceof Error) {
            ElMessage.error(err.message || '登录失败')
        }
        if (typeof err === 'string') {
            console.log(err)
            ElMessage.error(err)
        }
        formData.password = ''
    }
}

//注册
const registerUser = async () => {
    btnLoading.value = true
    try {
        await register(
            {
                username: formData.username,
                phone: formData.phone,
                password: formData.password,
                confirmPassword: formData.confirmPassword
            })
        ElMessage.success('注册成功，正在登录...')
        formData.account = formData.username || formData.phone
        formData.password = formData.password
        //刷新统计数据
        articleStore.isTotalRefresh = true
        await loginUser(true)
    } catch (err) {
        if (err instanceof Error) {
            ElMessage.error(err.message || '注册失败')
        }
        if (typeof err === 'string') {
            ElMessage.error(err)
        }
        //清空表单数据
        ruleFormRef.value?.resetFields()
    }
}
//提交表单
const submitForm = (formEl: FormInstance | undefined) => {
    if (btnLoading.value) return
    if (!formEl) return
    formEl.validate(async (valid) => {
        if (valid) {
            btnLoading.value = true
            try {
                // 校验通过后，根据登录注册类型提交表单数据
                if (type.value === 'login') {
                    //登录
                    await loginUser()
                } else if (type.value === 'register') {
                    //注册
                    await registerUser()
                }
            } finally {
                btnLoading.value = false
            }
        }
    })
}
//切换登录注册类型
const handleChangeType = () => {
    if (btnLoading.value) return
    type.value = type.value === 'login' ? 'register' : 'login'
    //清空表单数据
    formData.account = ''
    formData.password = ''
    formData.username = ''
    formData.phone = ''
    formData.confirmPassword = ''
    ruleFormRef.value?.clearValidate() //清除校验状态
}
onMounted(() => {
    type.value = route.query.type as string || 'login'
})
</script>

<style scoped lang="scss">
.logReg-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;

    .left {
        width: 55%;
        height: 100%;
        background: url('@/assets/images/background_2.jpg');
        background-size: cover;
    }

    .right {
        width: 45%;
        height: 100%;
        background-color: rgba(180, 210, 245, 0.25);
        padding: 30px;

        .back-btn {
            margin-top: 70px;
            margin-left: 30px;
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            font-size: 18px;
            color: #2c4452;

            .back-btn-text {
                font-size: 18px;
                color: #2c4452;
            }
        }

        .form {
            padding: 80px 20px;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 10px;

            .form-header {
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: start;
                font-size: 20px;
                color: #243239;
            }

            .form-content {
                margin-top: 30px;
                width: 60%;

                .el-form-item {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 40px;
                    gap: 10px;

                    :deep(.el-form-item__label) {
                        font-size: 16px;
                    }

                    :deep(.el-input__inner) {
                        height: 40px;
                        background-color: rgba(255, 255, 255, 0.8);
                    }
                }

                .tip {
                    margin-top: 20px;
                    text-align: center;

                    span {
                        font-size: 14px;
                        color: #94a3b8;
                        cursor: pointer;
                        transition: color 0.2s ease;

                        &:hover {
                            color: #205c75;
                        }
                    }

                }

                .el-button {
                    margin-top: 20px;
                    width: 100%;
                    height: 40px;
                    background-color: rgba(58, 134, 153, 0.85);
                    font-size: 18px;
                    color: #ffffff;

                    &:hover {
                        color: #ffffff;
                        opacity: 0.8;
                        box-shadow: none;
                        transform: none;
                    }

                    &:active {
                        background-color: rgba(95, 160, 182, 0.85);
                    }

                }
            }
        }

        .tip-text {
            margin-top: 170px;
            text-align: center;
            font-size: 14px;
            color: #909399;
            text-align: center;
        }
    }
}
</style>