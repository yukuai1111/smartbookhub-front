<template>
    <div class="home-page">
        <el-container>
            <el-header>
                <Header />
            </el-header>
            <el-main style="padding:0 !important">
                <div class="content-container">
                    <div class="home-text anim-item">
                        <h1 class="main-title">智能图书管理系统</h1>
                        <h2 class="sub-title">把读书的小想法，都好好安放</h2>
                        <p class="desc">
                            读完一本书总会冒出很多碎碎的感悟？<br />
                            可以在这里写下读书笔记，记录阅读时的喜怒哀乐。<br />
                            也可以逛一逛大家分享的文字，看看别人眼中的世界，遇见志同道合的阅读同好。
                        </p>
                        <div class="home-btn">
                            <el-button plain size="large" @click="router.push({name:'articleSquare'})">漫步知识广场</el-button>
                            <el-button plain size="large" @click="router.push({name:'aiConversation'})">与AI共读思考</el-button>
                        </div>
                    </div>
                </div>
            </el-main>
        </el-container>
    </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
<style scoped lang="scss">
.home-page {
    .el-header {
        height: 80px !important;
        padding: 0 !important;
    }

    .content-container {
        position: relative;
        height: calc(100vh - 80px);
        overflow: hidden;

        &::before {
            content: "";
            background-image: url('@/assets/images/background_1.jpg');
            background-size: 100% 100%;
            background-position: center;
            filter: blur(3px);
            position: absolute;
            inset: 0;
            background-color: rgba(0, 0, 0, 0.2);
        }

        @keyframes fadeUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .anim-item {
            animation: fadeUp 0.8s ease-out forwards;
            opacity: 0;
        }

        .home-text {
            position: relative;
            z-index: 2;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: #ffffff;
            gap: 20px;
            padding: 0 20px;

            .main-title {
                font-size: 50px;
                font-weight: 700;
                margin: 0;
                letter-spacing: 4px;
                text-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
                font-family: "STKaiti", "KaiTi", "宋体", "PingFang SC", sans-serif;
            }

            .sub-title {
                font-size: 25px;
                margin: 0;
                opacity: 0.9;
                letter-spacing: 2px;
                text-shadow: 0 1px 8px rgba(0, 0, 0, 0.2);
                font-family: "STKaiti", "KaiTi", "宋体", "PingFang SC", sans-serif;
                font-weight: 700;
            }

            .desc {
                font-size: 19px;
                line-height: 2.1;
                max-width: 700px;
                opacity: 0.9;
                text-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
                font-family: "STKaiti", "KaiTi", "楷体", "PingFang SC", sans-serif;
            }

            .home-btn {
                display: flex;
                gap: 24px;
                margin-top: 32px;
                flex-wrap: wrap;
                justify-content: center;

                :deep(.el-button) {
                    font-family: "STKaiti", "KaiTi", "宋体", "PingFang SC", sans‑serif;
                    font-size: 21px;
                    font-weight: 600;
                    width: 300px;
                    height: 50px;
                    border-radius: 999px;
                    border: none;
                    backdrop-filter: blur(8px);
                    transition: all 0.28s ease;
                }

                :deep(.el-button:first-child) {
                    background-color: rgba(54, 104, 153, 0.65);
                    color: #ffffff;
                    box-shadow: 0 3px 14px rgba(0, 0, 0, 0.18);
                }

                :deep(.el-button:nth-child(2)) {
                    background-color: rgba(255, 255, 255, 0.24);
                    color: #ffffff;
                    box-shadow: 0 3px 14px rgba(0, 0, 0, 0.15);
                }

                :deep(.el-button:hover) {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 22px rgba(0, 0, 0, 0.25);
                }

                :deep(.el-button:active) {
                    transform: translateY(-1px);
                }
            }

        }


    }
}
</style>
