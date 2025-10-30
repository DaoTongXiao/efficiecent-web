import { notification } from 'antd'
import { getAuthToken, isTokenValid } from '@/utils/auth'
import { ApiMessage, chatMessage, instertKnowledge } from '@/api/conversion/message'
import { useConversationStore, useKnowledgeStore, useUserStore } from '@/store'

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
      const knowledge = useKnowledgeStore.getState().curKnowledge
      const user_id = useUserStore.getState().user_info?.user_id
      if(knowledge){
       await instertKnowledge({
        collection_name: `k_${knowledge.id?.replace(/-/g, '_')}`,
        message_id: messageId,
        content: currentMessage.parts[0]?.toString(),
        meatadata: {
          conversation_id: currentMessage.conversation_id,
          message_id: currentMessage.id,
          user_id: user_id as string
        }
       })
      }
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
