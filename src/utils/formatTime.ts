//把时间化成刚刚（小于一分钟）/几分钟/几小时/几天前，超过7天就显示具体时间（年月日）
export const formatTime=(time:number)=>{
    const now=new Date()
    const diff=now.getTime()-time
    if(diff<1000*60){
        return '刚刚'
    }
    if(diff<1000*60*60&&diff>=1000*60){
        return `${Math.floor(diff/1000/60)}分钟前`
    }
    if(diff<1000*60*60*24&&diff>=1000*60*60){
        return `${Math.floor(diff/1000/60/60)}小时前`
    }
    if(diff<1000*60*60*24*7&&diff>=1000*60*60*24){
        return `${Math.floor(diff/1000/60/60/24)}天前`
    }
    return `${new Date(time).getFullYear()}-${new Date(time).getMonth()+1}-${new Date(time).getDate()}`
}
//把时间换成年
export const formatYear=(time:number)=>{
    const now=new Date()
    const diff=now.getTime()-time
    return `${Math.floor(diff/1000/60/60/24/365)}年`
}