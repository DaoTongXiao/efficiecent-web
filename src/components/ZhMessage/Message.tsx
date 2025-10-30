import { MessageType } from '@/types/typing'
import { ToolPart } from '@/api/conversion/message'

import { BatchResult } from './BatchResult'
import { MarkdownMessage } from './MarkdownMessage'


type Props = {
  message: MessageType
  styles?: Record<string, string>
}

// 类型守卫：检查 parts 是否为 ToolPart[]（用于 'product_status'）
const isToolParts = (parts: unknown): parts is ToolPart[] =>
  Array.isArray(parts) && parts.every((p) => typeof p === 'object' && 'category' in p && 'body' in p)

// 通用文本渲染：处理简单字符串或数组
const renderText = (parts: unknown, fallback = '无内容'): React.ReactNode => {
  if (typeof parts === 'string') return <p>{parts}</p>
  if (Array.isArray(parts)) {
    const content = parts.join('') ?? ''
    return content ? <p>{content}</p> : <p>{fallback}</p>
  }
  // Fallback: 安全序列化，避免暴露结构
  try {
    return <p>{typeof parts === 'object' ? JSON.stringify(parts) : String(parts)}</p>
  } catch {
    return <p>{fallback}</p>
  }
}

// 渲染单个 ToolPart（提取自 'product_status' 的 switch）
const renderToolPart = (part: ToolPart, index: number, styles?: Record<string, string>): React.ReactNode => {
  const { category, body } = part
  const categoryLower = category?.toLowerCase() ?? 'str'

  switch (categoryLower) {
    case 'md':
    case 'markdown':
      return <MarkdownMessage key={index} content={[body]} styles={styles} />
    case 'obj': {
      let objBody: unknown
      try {
        objBody = typeof body === 'string' ? JSON.parse(body) : body
      } catch {
        objBody = body // Fallback to raw body if parse fails
      }
      return <BatchResult key={index} body={objBody} />
    }
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


export const Message: React.FC<Props> = ({ message, styles }: Props): React.ReactNode => {
  const { content_type, parts } = message
  const typeLower = content_type?.toLowerCase() ?? 'str' // 默认 'str' 作为安全 fallback
  // console.log('message:', message)
  // console.log('content_type:', typeLower)
  switch (typeLower) {
    case 'text':
    case 'markdown':
    case 'md':
      let processedParts: string[] = [];
      if (Array.isArray(parts)) {
        processedParts = parts.map(item => typeof item === 'string' ? item : JSON.stringify(item));
        const lastPart = parts[parts.length - 1];
        if (typeof lastPart === 'object' && lastPart !== null && 'type' in lastPart && lastPart.type === 'rag_references' && 'data' in lastPart && Array.isArray(lastPart.data)) {
          const ragList = lastPart.data.map((item: unknown) => `- ${String(item)}`).join('\n');
          processedParts = [...processedParts.slice(0, -1), '\n\n**检索结果：**\n' + ragList];
        }
      } else {
        processedParts = [typeof parts === 'string' ? parts : JSON.stringify(parts)];
      }
      return <MarkdownMessage content={processedParts} styles={styles} />
    case 'obj':
      return <BatchResult body={parts} />
    case 'product_status':
      return renderParts(parts, styles, true) // ToolMode: true
    default:
      return renderText(parts)
  }
}

