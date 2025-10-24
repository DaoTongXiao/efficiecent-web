import { addTag } from '@guwave/utils'

/**
 * 跳转到AI助手页面
 * @param lot lotId
 */
export function toAiAgentPage(lot: string) {
  const win = window.top || window
  win.localStorage.setItem('lot', lot)
  addTag({
    tagName: 'AI数据分析助手',
    url: '',
    baseUrl: '/ai-analysis',
    params: `lot=${lot}`
  })
}