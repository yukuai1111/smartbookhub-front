<template>
    <div>
        <div ref="mainRef" style="width:100%;height:600px;"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'
const mainRef = ref<HTMLDivElement>()
let myChart: echarts.ECharts | null = null
const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    xdata: {
        type: Array,
        default: () => []
    },
    ydata1: {
        type: Array,
        default: () => []
    },
    ydata2: {
        type: Array,
        default: () => []
    },
    name: {
        type: String,
        default: ''
    }
})
const renderChart = () => {
    if (!myChart) {
        return
    }
    myChart.setOption({
        title: {
            text: props.title,
            left: 16,
            textStyle: {
                fontSize: 18,
                fontWeight: 600,
                color: '#303133'
            }
        },
        legend: {
            data: ['文章数', '对话数'],
            left: 'center',
            top: 10
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(255,255,255,0.92)',
            textStyle: { color: '#333' },
            borderColor: '#e5e7eb',
            borderWidth: 1,
            padding: 10
        },
        grid: {
            left: '4%',
            right: '4%',
            bottom: '3%',
            top: '18%',
            containLabel: true
        },
        xAxis: {
            data: props.xdata,
            axisLine: { lineStyle: { color: '#dcdfe6' } },
        },
        yAxis: {
            type: 'value',
            splitLine: { lineStyle: { color: '#f0f2f5' } },
            axisLine: { show: false },
            axisTick: { show: false }
        },
        series: [
            {
                name: '文章数',
                type: 'line',
                smooth: true,
                data: props.ydata1,
                symbol: 'circle',
                symbolSize: 8,
                itemStyle: {
                    color: '#28b8b8',
                    shadowColor: 'rgba(40, 184, 184, 0.35)',
                    shadowBlur: 6
                },
                lineStyle: {
                    color: '#28b8b8',
                    width: 3,
                    type: 'solid'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(40, 184, 184, 0.22)' },
                        { offset: 1, color: 'rgba(40, 184, 184, 0.02)' }
                    ])
                }
            },
            {
                name: '对话数',
                type: 'line',
                smooth: true,
                data: props.ydata2,
                symbol: 'circle',
                symbolSize: 8,
                itemStyle: {
                    color: '#7876dd',
                    shadowColor: 'rgba(120, 118, 221, 0.35)',
                    shadowBlur: 6
                },
                lineStyle: {
                    color: '#7876dd',
                    width: 3,
                    type: 'solid'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(120, 118, 221, 0.22)' },
                        { offset: 1, color: 'rgba(120, 118, 221, 0.02)' }
                    ])
                }
            }
        ]
    });
}
watch(() => [props.xdata, props.ydata1, props.ydata2], (newVal) => {
    renderChart()
}, { deep: true })
onMounted(() => {
    myChart = echarts.init(mainRef.value)
    renderChart()
})
</script>

<style scoped></style>