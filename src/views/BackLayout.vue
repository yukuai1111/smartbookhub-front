<template>
    <div class="backend-layout">
        <el-container>
            <el-header>
                <Header/>
            </el-header>
            <el-container class="main-container">
                <el-aside>
                    <BackAside />
                </el-aside>
                <el-main class="main-content">
                    <div class="content-container">
                        <RouterView />
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup name="BackLayout" lang="ts">
</script>

<style lang="scss" scoped>
.backend-layout {
    .el-header {
        height: 80px !important;
        padding: 0 !important;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 999;
    }

    .main-container {
        margin-top: 80px;

        :deep(.aside-page) {
            width: 300px;
            background-color: #273449;
            position: fixed;
            top: 90px;
            left: 0;
            bottom: 0;
        }

        :deep(.el-menu) {
            background-color: #273449;
            border-right: none;
        }

        :deep(.el-menu-item) {
            font-size: 16px;
            color: #cbd5e1;

            &:hover {
                background-color: rgba(59, 130, 246, 0.18);
                color: #ffffff;
            }
        }

        :deep(.el-sub-menu__title) {
            font-size: 16px;
            color: #cbd5e1;

            &:hover {
                background-color: rgba(59, 130, 246, 0.18);
                color: #ffffff;
            }
        }

        :deep(.el-sub-menu .el-menu-item) {
            color: #94a3b8;
            font-size: 15px;

            &:hover {
                background-color: rgba(59, 130, 246, 0.14);
                color: #e2e8f0;
            }
        }

        :deep(.el-menu-item.is-active) {
            background-color: rgba(255, 255, 255, 0.12) !important;
            color: #60a5fa !important;
            font-weight: 500;
        }

        .main-content {
            padding: 0 !important;
            min-height: 100vh;

            .content-container {
                padding: 10px;
                min-height: 100vh;
                background-color: #f1f5f9;
            }
        }
    }
}
</style>