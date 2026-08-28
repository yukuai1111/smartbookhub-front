import {get} from '@/utils/request'
import type {StatisticsData,StatisticsChart} from '@/interface/back'
//获取统计数据
export const getStatisticsData=async ()=>{
    return get<unknown,StatisticsData>('/admin/total')
}
//获取统计图表
export const getStatisticsChart=async ()=>{
    return get<unknown,StatisticsChart>('/admin/chart')
}
