import { DateRangeParam } from '@/components/DateSelector/DateSelector'
import { DeviceParam } from '@/components/Business/DeviceSelector/DeviceSelector'
import { getReports } from '@/api/report'
import { batchOverview, productStatus, ToolResonse } from '@/api/tools'
import { ApiMessage, createMessage } from '@/api/message'
import { AxiosError } from 'axios'
import { useCallback } from 'react'
import { useConversationStore } from '@/store'

// 公共消息动作hook：提取重复逻辑，提供核心工具
const useMessageActions = () => {
  const { curConversation, updateMessage, addMessage } = useConversationStore()

  // 创建用户消息（通用）
  const createUserMessage = useCallback(
    async (value: string): Promise<string> => {
      const message = await createMessage({
        conversation_id: curConversation,
        role: 'user',
        status: 'success',
        content_type: 'text',
        parts: [value]
      })
      addMessage({
        id: message.data.id,
        status: 'success',
        role: 'user',
        parts: [value],
        content_type: 'text',
        conversation_id: curConversation,
        create_time: new Date().toISOString(),
        end_turn: 0
      })
      return message.data.id
    },
    [curConversation, addMessage]
  )

  // 创建AI模板消息（通用）
  const createAIMessageTemplate = useCallback(
    async (parentId: string): Promise<{ key: string; aiMessage: ApiMessage }> => {
      const key = `AI-${Date.now()}`
      const templateMessage: ApiMessage = {
        id: key,
        status: 'success',
        role: 'ai',
        parts: ['正在加载中...'],
        content_type: 'text',
        conversation_id: curConversation,
        parent: parentId,
        create_time: new Date().toISOString(),
        end_turn: 0
      }
      const apiRes = await createMessage(templateMessage)
      const aiMessage = apiRes.data
      addMessage(aiMessage)
      return { key: aiMessage.id, aiMessage }
    },
    [curConversation, addMessage]
  )

  // 统一错误处理（现在支持parentId，让错误消息引用用户消息）
  const handleError = useCallback(
    async (error: unknown, fallbackMsg?: string, parentId?: string) => {
      console.error('Message action error:', error)
      let errorMsg = fallbackMsg || '发生未知错误，请重试'
      if (error instanceof AxiosError && error.response?.data?.detail) {
        errorMsg = error.response.data.detail
      }
      console.error({ message: errorMsg })

      const errorKey = `AI-${Date.now()}`
      const errorMessage: ApiMessage = {
        id: errorKey,
        status: 'success',
        role: 'ai',
        parts: [errorMsg],
        content_type: 'text',
        conversation_id: curConversation,
        parent: parentId, // 添加parent引用
        create_time: new Date().toISOString(),
        end_turn: 0
      }
      const apiRes = await createMessage(errorMessage)
      addMessage(apiRes.data)
    },
    [curConversation, addMessage]
  )

  return { createUserMessage, createAIMessageTemplate, handleError, updateMessage }
}

/**
 * Report查询（优化：复用公共动作，只专注报表更新）
 */
export const useDateSelectAction = (closeDateSelector: () => void) => {
  const { createUserMessage, createAIMessageTemplate, handleError, updateMessage } = useMessageActions()

  // 更新AI消息为报表数据
  const updateAIMessageWithReport = useCallback(
    async (param: DateRangeParam, key: string, aiMessage: ApiMessage) => {
      const data = await getReports({
        start_date: param.dateStart,
        end_date: param.dateEnd
      })
      if (data.code !== 200) {
        throw new Error('获取报表数据失败，请重试。')
      }
      const updatedMessage: ApiMessage = {
        ...aiMessage,
        parts: data.data.reports,
        content_type: 'report' // 保持原样
      }
      updateMessage(key, updatedMessage, true)
    },
    [updateMessage]
  )

  // 保存日期选择器（核心流程：统一try-catch，错误时传入parentId）
  const saveDateSelector = useCallback(
    async (param: DateRangeParam) => {
      closeDateSelector() // 先关闭UI
      let userMessageId: string | undefined
      try {
        const value = `查询${param.dateStart}到${param.dateEnd}的报表`
        userMessageId = await createUserMessage(value)
        const { key, aiMessage } = await createAIMessageTemplate(userMessageId)
        await updateAIMessageWithReport(param, key, aiMessage)
      } catch (error) {
        if (userMessageId) {
          await handleError(error, undefined, userMessageId) // 传入parentId
        } else {
          await handleError(error)
        }
      }
    },
    [createUserMessage, createAIMessageTemplate, updateAIMessageWithReport, handleError, closeDateSelector]
  )

  return { saveDateSelector }
}

/**
 * 产品选择器（优化：类似复用，动态content_type基于eventType）
 */
export const useDeviceSelectAction = (eventType: string, closeDeviceSelector: () => void) => {
  const { createUserMessage, createAIMessageTemplate, handleError, updateMessage } = useMessageActions()

  // 更新AI消息为产品数据（根据eventType分支，动态content_type）
  const updateAIMessageWithProduct = useCallback(
    async (param: DeviceParam, key: string, aiMessage: ApiMessage) => {
      let data: ToolResonse
      let contentType: string
      if (eventType === 'productStatus') {
        data = await productStatus({
          device_id: param.deviceId || '',
          prompt: param.prompt,
          date_start: param.dateStart,
          date_end: param.dateEnd
        })
        contentType = 'product_status'
      } else if (eventType === 'batchOverview') {
        data = await batchOverview({
          device_id: param.deviceId || '',
          prompt: param.prompt,
          date_start: param.dateStart,
          date_end: param.dateEnd
        })
        contentType = 'batch_overview' // 建议区分，避免硬编码
      } else {
        throw new Error('未知的eventType')
      }

      if (data.code !== 200) {
        throw new Error('获取数据失败，请重试。')
      }
      const updatedMessage: ApiMessage = {
        ...aiMessage,
        parts: data.data,
        content_type: contentType
      }
      updateMessage(key, updatedMessage, true)
    },
    [updateMessage, eventType]
  )

  // 保存设备选择器（类似日期，错误时传入parentId）
  const saveDeviceSelector = useCallback(
    async (param: DeviceParam) => {
      closeDeviceSelector()
      let userMessageId: string | undefined
      try {
        const value = param.prompt
        userMessageId = await createUserMessage(value)
        const { key, aiMessage } = await createAIMessageTemplate(userMessageId)
        await updateAIMessageWithProduct(param, key, aiMessage)
      } catch (error) {
        if (userMessageId) {
          await handleError(error, undefined, userMessageId)
        } else {
          await handleError(error)
        }
      }
    },
    [createUserMessage, createAIMessageTemplate, updateAIMessageWithProduct, handleError, closeDeviceSelector]
  )

  return { saveDeviceSelector }
}
