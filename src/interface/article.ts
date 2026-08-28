//文章列表
export interface ArticleInfo {
    id: number,
    code: string,
    author: string,
    author_id: string,
    title: string,
    summary: string,
    cover: string,
    createTime: number,
    updateTime: number,
    read_count: number,
    status: string,
    reject_reason: string|null,
    offline_reason: string|null,
    rejectTime: number | null,
    offlineTime: number | null,
    commentCount?: number,
    content?: string,
}
//管理员获取文章列表的请求体
export interface GetArticleListRequest {
    page?: number;
    pageSize?: number;
    status?: number | null,
    onlySelf?: boolean | null,
    authorId?: string | null,
}
//获取文章列表的响应体
export interface GetArticleListResponse {
    articleList: ArticleInfo[],
    totalSize: number,
    currentSize: number
}
//文章
export interface Article {
    title: string,
    summary: string,
    content: string,
    articleCode?: string,
}
//读者
export interface Reader {
    id: string,
    readerName: string,
    avatar: string,
}
//读者列表响应体
export interface GetReadersResponse {
    size: number,
    readerList: Reader[]
}

export interface Recomment{
    id: number,
    code: string,
    title: string,
    cover: string,
    author: string,
    read_count: number,
    createTime:number
}
//推荐文章列表响应体
export interface GetRecommendListResponse {
    recommendList: Recomment[],
    size: number
}

