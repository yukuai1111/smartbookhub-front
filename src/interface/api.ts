//响应基本类型
export interface Response<T> {
    status: number,
    message: string,
    success: boolean,
    data?: T
}

//菜单的基本类型
export interface Menu {
    index: string,
    router: string,
    type: string,
    title: string,
}

//流式回调函数定义类型
//类型
type StreamChunkType = 'onchunk' | 'conv_id' | 'error' | 'complete'
//返回给页面的消息
interface Data {
    type: StreamChunkType,
    content?: string,
    session_id?: string,
    message_id?: number,
    ai_msgId?:number
}
export type OnChunk = (data: Data) => void
export type OnCompleted = () => void
export type OnError = (errmsg: string) => void