//统计数据
export interface StatisticsData{
    userCount:number,
    articleCount:number,
    publishCount:number,
    commentCount:number
}
//统计图表
export interface StatisticsChart{
    dateList:string[]
    articleList:number[]
    conversationList:number[]
}
