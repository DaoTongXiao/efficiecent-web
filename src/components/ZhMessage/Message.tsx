import { MessageType } from '@/types/typing'
import { ToolPart } from '@/api/conversion/message'
import { MarkdownMessage } from './MarkdownMessage'
import { SearchResults } from './SearchResults'

type Props = {
  message: MessageType
  styles?: Record<string, string>
}

// 类型守卫：检查 parts 是否为 ToolPart[]（用于 'product_status'）
const isToolParts = (parts: unknown): parts is ToolPart[] =>
  Array.isArray(parts) &&
  parts.every((p) => typeof p === 'object' && 'category' in p && 'body' in p)

// 通用文本渲染：处理简单字符串或数组
const renderText = (parts: unknown, fallback = '无内容'): React.ReactNode => {
  if (typeof parts === 'string') return <p>{parts}</p>
  if (Array.isArray(parts)) {
    const content = parts.join('') ?? ''
    return content ? <p>{content}</p> : <p>{fallback}</p>
  }
  // Fallback: 安全序列化，避免暴露结构
  try {
    return (
      <p>{typeof parts === 'object' ? JSON.stringify(parts) : String(parts)}</p>
    )
  } catch {
    return <p>{fallback}</p>
  }
}

// 渲染单个 ToolPart（提取自 'product_status' 的 switch）
const renderToolPart = (
  part: ToolPart,
  index: number,
  styles?: Record<string, string>
): React.ReactNode => {
  const { category, body } = part
  const categoryLower = category?.toLowerCase() ?? 'str'

  switch (categoryLower) {
    case 'md':
    case 'markdown':
      return <MarkdownMessage key={index} content={[body]} styles={styles} />
    case 'str':
    default:
      return <p key={index}>{body ?? ''}</p>
  }
}

// 渲染 parts 数组（通用，用于 'product_status' 等）
const renderParts = (
  parts: unknown,
  styles?: Record<string, string>,
  isToolMode = false
): React.ReactNode => {
  if (!parts || (Array.isArray(parts) && parts.length === 0)) {
    return <p>无内容</p>
  }

  if (isToolMode && isToolParts(parts)) {
    return (
      <div>
        {parts.map((part, index) => renderToolPart(part, index, styles))}
      </div>
    )
  }

  // 非 ToolMode：简单渲染
  return renderText(parts)
}

export const Message: React.FC<Props> = ({
  message,
  styles
}: Props): React.ReactNode => {
  const { content_type, parts } = message
  const typeLower = content_type?.toLowerCase() ?? 'str' // 默认 'str' 作为安全 fallback
  // console.log('message:', message)
  // console.log('content_type:', typeLower)
  switch (typeLower) {
    case 'text':
    case 'markdown':
    case 'md': {
      let processedParts: string[] = []
      let searchResultsData: unknown[] | null = null
      if (Array.isArray(parts)) {
        processedParts = parts.map((item) => {
          if (typeof item === 'object' && item !== null && 'type' in item) {
            if (
              item.type === 'search_results' &&
              'data' in item &&
              Array.isArray(item.data)
            ) {
              searchResultsData = item.data
              return '' // 不添加到 processedParts
            } else if (
              item.type === 'rag_references' &&
              'data' in item &&
              Array.isArray(item.data)
            ) {
              const ragList = item.data
                .map((item: unknown) => `- ${String(item)}`)
                .join('\n')
              return '\n\n**检索结果：**\n' + ragList
            } else {
              return JSON.stringify(item)
            }
          } else {
            return typeof item === 'string' ? item : JSON.stringify(item)
          }
        })
      } else {
        processedParts = [
          typeof parts === 'string' ? parts : JSON.stringify(parts)
        ]
      }
      if (searchResultsData) {
        return (
          <div>
            <MarkdownMessage content={processedParts} styles={styles} />
            <SearchResults data={searchResultsData} />
          </div>
        )
      } else {
        return <MarkdownMessage content={processedParts} styles={styles} />
      }
    }
    case 'product_status':
      return renderParts(parts, styles, true) // ToolMode: true
    case 'search_results':
      if (
        typeof parts === 'object' &&
        parts !== null &&
        'data' in parts &&
        Array.isArray(parts.data)
      ) {
        return <SearchResults data={parts.data} />
      }
      return <p>无效的搜索结果数据</p>
    default:
      return renderText(parts)
  }
}
