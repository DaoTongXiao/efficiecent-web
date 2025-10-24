import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

type MarkdownMessageProps = {
  content: string[] | unknown[]
  styles?: Record<string, string>
}

const markdownToLatex = (md: string): string => {
  console.log('原始输入:', md)

  const result = md
  
  // 1. 处理多行的 \[...\] 格式
  const step1 = result.replace(/\\\[\s*\n*([\s\S]*?)\n*\s*\\\]/g, (_match, inner) => {
    const cleaned = inner.replace(/\s*\n\s*/g, ' ').trim()

    return `$$${cleaned}$$`
  })
  
  // 2. 处理单行的 \[...\] 格式
  const step2 = step1.replace(/\\\[\s*(.*?)\s*\\\]/g, (_match, inner) => {
    const cleaned = inner.trim()

    return `$$${cleaned}$$`
  })
  
  // 3. 处理 [[...]] 格式
  const step3 = step2.replace(/\[\[\s*([\s\S]*?)\s*\]\]/g, (_match, inner) => {
    const cleaned = inner.replace(/\n\s*/g, ' ').trim()
    return `$$${cleaned}$$`
  })
  
  // 4. 清理可能剩余的单独 [ 字符（如果前面的替换有遗漏）
  const step4 = step3.replace(/\[\s*(\$\$[\s\S]*?\$\$)/g, '$1')

  
  return step4
}

/**
 * MarkdownMessage
 */
export const MarkdownMessage: React.FC<MarkdownMessageProps> = ({ content, styles }) => {
  // 如果是 string[]，直接使用；如果是其他类型，尝试转换为字符串
  const markdownContent = Array.isArray(content)
    ? content.map(item => typeof item === 'string' ? item : JSON.stringify(item)).join('\n\n')
    : typeof content === 'string' ? content : JSON.stringify(content)

  // 转换内容为正确的 LaTeX 格式
  const content_str = markdownToLatex(markdownContent)

  try {
    return (
      <ReactMarkdown
        remarkPlugins={[
          remarkGfm,
          [remarkMath, {
            singleDollarTextMath: true,
            displayMath: [['$$', '$$']],
            inlineMath: [['$', '$']]
          }]
        ]}
        rehypePlugins={[[rehypeKatex, {
          throwOnError: false,
          errorColor: '#cc0000',
          displayMode: false, // 让 KaTeX 自动判断显示模式
          fleqn: false,
          macros: {
            '\\RR': '\\mathbb{R}',
            '\\NN': '\\mathbb{N}',
            '\\ZZ': '\\mathbb{Z}',
            '\\QQ': '\\mathbb{Q}',
            '\\CC': '\\mathbb{C}'
          }
        }]]}
        className={styles?.mdContainer}
        components={{
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          code({ node, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '')
            const isInline = !match
            return !isInline ? (
              <SyntaxHighlighter
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                style={oneDark as any}
                language={match ? match[1] : ''}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          }
        }}
      >
        {content_str || '无内容'}
      </ReactMarkdown>
    )
  } catch (error) {
    console.error('Markdown rendering error:', error)
    return (
      <div className={styles?.mdContainer}>
        <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
          {markdownContent || '无内容'}
        </pre>
      </div>
    )
  }
}