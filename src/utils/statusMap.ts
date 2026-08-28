export const statusMap: Record<string, number> = {
    "all": 0,
    "draft": 1,
    "published": 2,
    "pending": 3,
    "offline": 4,
    "rejected": 5,
}

type ElTagType = 'info' | 'primary' | 'success' | 'warning' | 'danger'
export const statusColorMap:Record<string,ElTagType> = {
   'pending':'warning',
   'offline':'info',
   'published':'success',
   'draft':'info',
   'rejected':'danger',
}

export const statusNameMap:Record<string,string> = {
  'pending':'待审核',
  'offline':'已下线',
  'published':'已发布',
  'draft':'草稿',
  'rejected':'已驳回',
}