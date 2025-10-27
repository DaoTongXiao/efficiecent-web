
import { ApiMessage, createMessage } from '@/api/conversion/message'
import { AxiosError } from 'axios'
import { useCallback } from 'react'
import { useConversationStore } from '@/store'

// 公共消息动作hook：提取重复逻辑，提供核心工具
export const useMessageActions = () => {
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


