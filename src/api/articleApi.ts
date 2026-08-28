import { post, get, put, remove } from '@/utils/request'
import type { GetArticleListRequest, GetArticleListResponse, Article,ArticleInfo,GetReadersResponse,GetRecommendListResponse } from '@/interface/article'

//管理员获取文章列表
export const getArticleList = async (data: GetArticleListRequest) => {
    return get<GetArticleListRequest, GetArticleListResponse>('/article/adminList', data)
}
//新增文章
export const addArticle = async (data: Article, cover?: File | null) => {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('summary', data.summary)
    formData.append('content', data.content)
    if (cover) {
        formData.append('cover', cover)
    }
    return post<FormData, { code: string }>('/article/add', formData)
}
//删除文章
export const deleteArticle = async (articleCode: string) => {
    return remove<{ articleCode: string }, { code: string }>('/article/remove', { articleCode })
}
//发布文章
export const publishArticle = async (articleCode: string) => {
    return put<{ articleCode: string }, { code: string }>('/article/publish', { articleCode })
}
//下线文章
export const offlineArticle = async (articleCode: string, offlineReason?: string) => {
    return put<{articleCode: string, offlineReason?: string}, { code: string }>('/article/offline', {articleCode, offlineReason})
}
//获取文章详情
export const getArticleDetail=async (articleCode:string)=>{
    return get<{articleCode:string},ArticleInfo>('/article/detail',{articleCode})
}

//修改文章
export const updateArticle=async (data:Article,cover?:File|null)=>{
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('summary', data.summary)
    formData.append('content', data.content)
    formData.append('articleCode', data.articleCode!)
    if (cover) {
        formData.append('cover', cover)
    }
    return put<FormData, {code:string}>('/article/update',formData)
}

//审核不通过
export const rejectArticle=async (articleCode:string, rejectReason:string)=>{
    return put<{articleCode:string, rejectReason:string}, {code:string,rejectReason:string}>('/article/reject',{articleCode, rejectReason})
}

//审核通过
export const approveArticle=async (articleCode:string)=>{
    return put<{articleCode:string}, {code:string}>('/article/pass',{articleCode})
}

//获取读者列表
export const getReaders=async (articleCode:string)=>{
    return get<{articleCode:string}, GetReadersResponse>('/article/reader',{articleCode})
}

//普通用户获取文章列表 
export const getProfileList=async (data:GetArticleListRequest)=>{
    return get<GetArticleListRequest, GetArticleListResponse>('/article/userList', data)
}

//获取推荐文章
export const getRecommendList=async ()=>{
    return get<unknown, GetRecommendListResponse>('/article/recommend')
}
