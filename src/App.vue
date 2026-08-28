<script setup lang="ts">
import { useArticleStore } from '@/stores/articleStore'

const articleStore = useArticleStore()
</script>

<template>
    <RouterView />
         <!-- 新增文章弹窗 -->
    <ArticleDialog v-if="articleStore.dialogShow" />
</template>
