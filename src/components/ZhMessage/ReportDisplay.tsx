import { MessageType } from '@/types/typing'
import type { Report } from '@/api/types'
import dayjs from 'dayjs'
import { Button, Modal, Spin } from 'antd'
import { createStyles } from 'antd-style'
import { useState } from 'react'
import { getReportContent, postDailySummary } from '@/api/report'
import { createMessage } from '@/api/message'
import useConversationStore from '@/store/conversationStore'

type ReportDisplayProps = {
  message: MessageType
}

const useStyles = createStyles(({ token: _token, css }) => ({
  container: css`
    width: 100%;
    min-width: 300px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 8px 0;
  `,
  reportItem: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    background-color: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
  `,
  content: css`
    flex: 1;
    min-width: 0;
  `,
  title: css`
    font-size: 14px;
    font-weight: 500;
    color: #1f2937;
    margin-bottom: 6px;
    word-break: break-word;
  `,
  description: css`
    font-size: 12px;
    color: #6b7280;
    line-height: 1.4;
  `,
  actionButton: css`
    margin-left: 16px;
    border-radius: 4px;
    font-size: 12px;
    padding: 4px 12px;
  `
}))

export const ReportDisplay: React.FC<ReportDisplayProps> = ({ message }) => {
  const { styles } = useStyles()
  const { addMessage, updateMessage } = useConversationStore()
  const reports = message.parts as Report[]
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [htmlContent, setHtmlContent] = useState('')

  const handleViewDetails = async (report: Report) => {
    setSelectedReport(report)
    setIsModalVisible(true)
    setLoading(true)
    setHtmlContent('')

    try {
      if (report.document_id) {
        const response = await getReportContent(report.document_id)
        if (response.code === 200 && response.data) {
          setHtmlContent(response.data.content || '')
        } else {
          setHtmlContent(
            '<div style="padding: 20px; color: red;">获取报告内容失败</div>'
          )
        }
      } else {
        setHtmlContent(
          '<div style="padding: 20px; color: orange;">报告不存在文档ID</div>'
        )
      }
    } catch (error) {
      console.error('获取报告内容失败:', error)
      setHtmlContent(
        '<div style="padding: 20px; color: red;">获取报告内容时发生错误</div>'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleModalClose = () => {
    setIsModalVisible(false)
    setSelectedReport(null)
  }

  const extractTextFromHtml = (html: string): string => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    // 查找 body 元素
    const body = doc.body
    if (!body) {
      // 如果没有 body，提取整个文档的文本
      return doc.documentElement?.textContent?.trim() || ''
    }

    // 递归获取 body 内的文本内容
    const getTextContent = (element: Element): string => {
      let text = ''
      for (const child of element.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
          text += child.textContent || ''
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const childElement = child as Element
          // 跳过样式相关的元素
          if (
            !['style', 'script', 'link', 'meta'].includes(
              childElement.tagName.toLowerCase()
            )
          ) {
            text += getTextContent(childElement)
          }
        }
      }
      return text
    }

    return getTextContent(body).trim()
  }

  const handleSmartSummary = async (report: Report) => {
    // 创建用户消息占位
    const userMessageData = {
      conversation_id: message.conversation_id,
      role: 'user',
      content_type: 'text',
      parts: [
        `总结${report.file_name?.replace('.html', '') || `Report_${report.id}`}`
      ],
      status: 'completed',
      end_turn: 0,
      parent: message.id
    }
    try {
      const userResponse = await createMessage(userMessageData)
      if (userResponse.code === 200) {
        const userMessage = userResponse.data
        addMessage(userMessage)

        // 创建总结消息占位
        const summaryMessageData = {
          conversation_id: message.conversation_id,
          role: 'ai',
          content_type: 'text',
          parts: ['正在生成总结...'],
          message_metadata: {
            data: ''
          },
          status: 'in_progress',
          end_turn: 1,
          parent: userMessage.id
        }
        const summaryResponse = await createMessage(summaryMessageData)
        if (summaryResponse.code === 200) {
          const summaryMessage = summaryResponse.data
          addMessage(summaryMessage)

          // 异步处理总结
          try {
            if (report.document_id) {
              const response = await getReportContent(report.document_id)
              if (response.code === 200 && response.data) {
                const html = response.data.content || ''
                const textContent = extractTextFromHtml(html)
                const postResponse = await postDailySummary(textContent)
                if (postResponse.code === 200) {
                  const summaryText =
                    String(postResponse.data) || '总结生成成功，但无内容'
                  const updatedSummary = {
                    ...summaryMessage,
                    parts: [summaryText],
                    message_metadata: {
                      data: textContent
                    },
                    status: 'completed'
                  }
                  updateMessage(summaryMessage.id, updatedSummary, true)
                } else {
                  const errorMsg = '生成总结失败，请稍后重试'
                  const updatedSummary = {
                    ...summaryMessage,
                    parts: [errorMsg],
                    message_metadata: {
                      data: textContent
                    },
                    status: 'completed'
                  }
                  updateMessage(summaryMessage.id, updatedSummary, true)
                }
              } else {
                const errorMsg = '获取报告内容失败，无法生成总结'
                const updatedSummary = {
                  ...summaryMessage,
                  parts: [errorMsg],
                  status: 'completed'
                }
                updateMessage(summaryMessage.id, updatedSummary, true)
              }
            } else {
              const errorMsg = '报告不存在文档ID，无法生成总结'
              const updatedSummary = {
                ...summaryMessage,
                parts: [errorMsg],
                status: 'completed'
              }
              updateMessage(summaryMessage.id, updatedSummary, true)
            }
          } catch (_error) {
            const errorMsg = '生成总结时发生错误，请稍后重试'
            const updatedSummary = {
              ...summaryMessage,
              parts: [errorMsg],
              status: 'completed'
            }
            updateMessage(summaryMessage.id, updatedSummary, true)
          }
        } else {
          // 创建总结占位失败，更新用户消息为错误
          const errorMsg = '创建总结请求失败'
          const updatedUser = {
            ...userMessage,
            parts: [`${userMessage.parts[0]} - ${errorMsg}`]
          }
          updateMessage(userMessage.id, updatedUser, true)
        }
      } else {
        // 创建用户消息失败，创建错误消息
        const errorMessageData = {
          conversation_id: message.conversation_id,
          role: 'ai',
          content_type: 'text',
          parts: ['创建总结请求失败，请稍后重试'],
          status: 'completed',
          end_turn: 1,
          parent: message.id
        }
        const errorResponse = await createMessage(errorMessageData)
        if (errorResponse.code === 200) {
          addMessage(errorResponse.data)
        }
      }
    } catch (error) {
      // 整体错误，创建错误消息
      const errorMessageData = {
        conversation_id: message.conversation_id,
        role: 'ai',
        content_type: 'text',
        parts: ['智能总结功能暂时不可用，请稍后重试'],
        status: 'completed',
        end_turn: 1,
        parent: message.id
      }
      try {
        const errorResponse = await createMessage(errorMessageData)
        if (errorResponse.code === 200) {
          addMessage(errorResponse.data)
        }
      } catch (_createError) {
        // 如果连错误消息都创建失败，只能 console
        console.error('智能总结失败:', error)
      }
    }
  }

  return (
    <>
      <div className={styles.container}>
        {reports.map((report) => (
          <div key={report.id} className={styles.reportItem}>
            <div className={styles.content}>
              <div className={styles.title}>
                {report.file_name?.replace('.html', '') ||
                  `Report_${report.id}`}
              </div>
              <div className={styles.description}>
                创建时间:{' '}
                {dayjs(report.create_time).format('YYYY-MM-DD') || 'N/A'}
              </div>
            </div>
            <Button
              type="primary"
              size="small"
              className={styles.actionButton}
              onClick={() => handleSmartSummary(report)}
            >
              智能总结
            </Button>
            <Button
              type="primary"
              size="small"
              className={styles.actionButton}
              onClick={() => handleViewDetails(report)}
            >
              查看详情
            </Button>
          </div>
        ))}
      </div>

      <Modal
        title={`${selectedReport?.file_name?.replace('.html', '') || `Report_${selectedReport?.id}`} - 详情`}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={1000}
        centered={true}
        destroyOnHidden={true}
      >
        {loading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px'
            }}
          >
            <Spin size="large" />
          </div>
        ) : (
          <div
            dangerouslySetInnerHTML={{
              __html:
                htmlContent ||
                '<div style="padding: 20px; color: gray;">暂无内容</div>'
            }}
            style={{
              maxHeight: '60vh',
              overflow: 'auto',
              padding: '10px 0'
            }}
          />
        )}
      </Modal>
    </>
  )
}
