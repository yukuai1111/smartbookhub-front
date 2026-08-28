//提取编辑器里的纯文本
export const getPlainText = (html: string): string => {
    if (!html) return ''
    const div = document.createElement('div')
    div.innerHTML = html
    return div.textContent || ''
}