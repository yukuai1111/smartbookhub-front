import type { Menu } from '@/interface/api'
//菜单的展开
export const getMenuOpen = (path: string, prefix: string, index: string, openList: string[]) => {
    //path:当前路径
    //prefix:菜单前缀
    //index:当前菜单索引
    //openList:展开的菜单列表
    if (path.startsWith(prefix)) {
        openList.push(index)
    }
}
//菜单的高亮
export const getActiveMenu = (
    queryType: string,
    index: string,
    list: Menu[]
) => {
    //queryType:查询参数类型（文章类型）
    //path:当前路径
    //prefix:菜单前缀
    //index:当前菜单索引
    //list:菜单列表
    const target = list.find(item => item.type === queryType)
    if (target) {
        return target.index
    } else {
        return index
    }
}
