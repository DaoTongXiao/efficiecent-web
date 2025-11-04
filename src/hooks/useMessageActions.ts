import { notification } from 'antd'
import { getAuthToken, isTokenValid } from '@/utils/auth'
import { ApiMessage, chatMessage } from '@/api/conversion/message'
import { useConversationStore } from '@/store'

export const useMessageActions = () => {
    const [api] = notification.useNotification()

   const { messages, updateMessage } = useConversationStore() // selector只取需要的


  const handleMessageAction = async (
     key: string,
     messageId: string,
     _content: React.ReactElement<{ message: ApiMessage }>
   ) => {
     const currentMessage = messages.find((m) => m.id === messageId)
     if (!currentMessage) return

     if (key === 'like') {
       const newWeight = (currentMessage?.weight ?? 0) <= 0 ? 1 : ((currentMessage?.weight ?? 0) + 1)
       updateMessage(messageId, { ...currentMessage, weight: newWeight }, true)
     } else if (key === 'unlike') {
       const newWeight = (currentMessage?.weight ?? 0) >= 0 ? -1 : ((currentMessage?.weight ?? 0) - 1)
       updateMessage(messageId, { ...currentMessage, weight: newWeight }, true)
     } else if (key === 'reload') {
       await handleReload(currentMessage, messageId)
     } else if (key === 'addVector') {
       // 这个逻辑现在在 ChatList 组件中处理，不在这里处理
       // 保留空实现以避免错误
     }
   }

  const handleReload = async (currentMessage: ApiMessage, messageId: string) => {
    const token = getAuthToken()
    if (!isTokenValid(token)) {
      api.error({ message: 'Authentication failed, please login again.' })
      return
    }

    try {
      // 设置加载状态
      updateMessage(messageId, {
        ...currentMessage,
        status: 'loading',
        parts: ['重新思考中...'],
        create_time: new Date().toISOString()
      }, false)

      const allMessages = useConversationStore.getState().messages // 仅在需要时访问
      const parentMessage = allMessages.find((m: ApiMessage) => m.id === currentMessage.parent)
      if (!parentMessage) {
        throw new Error('无法找到对应的用户消息')
      }

      const aiMsg = await chatMessage({
        conversation_id: currentMessage.conversation_id,
        role: 'ai',
        status: 'success',
        content_type: 'text',
        parts: parentMessage.parts,
        parent: parentMessage.id
      })

      updateMessage(messageId, {
        id: aiMsg.data.id,
        status: 'success',
        parts: aiMsg.data.parts,
        role: 'ai',
        content_type: 'text',
        conversation_id: currentMessage.conversation_id,
        end_turn: 1,
        create_time: new Date().toISOString()
      }, false)
    } catch (_error) {
      // 回滚
      updateMessage(messageId, { ...currentMessage, status: 'success' }, false)
      api.error({ message: '重新加载失败，请重试' })
    }
  }

  return { handleMessageAction }
}
