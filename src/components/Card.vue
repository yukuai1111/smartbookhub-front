<template>
    <div class="card" :style="{ background: props.bgColor }">
        <div class="card-icon">
          <el-image :src="iconImg" alt="icon" style="width: 35px; height: 35px;"/>
        </div>
        <div class="card-content">
            <div class="card-title" :style="{ color: props.titleColor }">{{ props.title }}</div>
            <div class="card-value" :style="{ color: props.valueColor }">{{ props.value }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed} from 'vue'
const props = defineProps({
    title: { type: String, default: '' },
    value: { type: Number, default: 0 },
    icon: { type: String, default: '' },
    bgColor: { type: String, default: '#f5f5f5' },
    iconColor: { type: String, default: '#409eff' },
    titleColor: { type: String, default: '#606266' },
    valueColor: { type: String, default: '#303133' }
})
const iconImg=computed(()=>new URL(`../assets/images/icon_${props.icon}.png`,import.meta.url).href)
</script>

<style scoped lang="scss">
.card {
    display: flex;
    align-items: center;
    gap: 30px;
    flex-wrap: wrap;
    border-radius: 10px;
    padding: 24px 20px;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.07);

    .card-icon {
        font-size: 28px;
        margin-left: 10px
    }

    .card-content {
        display: flex;
        flex-direction: column;
        gap: 6px;
        flex:1;

        .card-title {
            font-size: 15px;
        }

        .card-value {
            font-size: 26px;
            font-weight: 700;
        }
    }

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.11);
        transition: all 0.3s ease-in-out;
    }
}
</style>
