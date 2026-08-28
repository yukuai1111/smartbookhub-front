<template>
    <div class="profile-layout">
        <el-container>
            <el-header>
                <Header/>
            </el-header>
            <el-container class="main-container">
                <el-aside>
                    <FrontAside />
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

<script setup lang="ts">
</script>

<style scoped lang="scss">
.profile-layout {
    .el-header {
        padding: 0 !important;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 999;
    }

    .main-container {
        margin-top: 90px;

        :deep(.aside-page) {
            width: 300px;
            background-color: #eef1f7;
            position: fixed;
            top: 90px;
            left: 0;
            bottom: 0;
        }

        :deep(.el-menu) {
            background-color: #eef1f7;
            border-right: none;
        }

        :deep(.el-menu-item) {
            font-size: 16px;
            color: #22334b;

            &:hover {
                background-color: #c0d2ec;
                color: #14243b;
            }
        }

        :deep(.el-sub-menu__title) {
            font-size: 16px;
            color: #22334b;

            &:hover {
                background-color: #c0d2ec;
                color: #14243b;
            }
        }

        :deep(.el-sub-menu .el-menu-item) {
            color: #405470;
            font-size: 15px;

            &:hover {
                background-color: #d4e0f0;
                color: #1f324d;
            }
        }

        :deep(.el-menu-item.is-active) {
            background-color: #bdd0eb !important;
            color: #14243b !important;
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
