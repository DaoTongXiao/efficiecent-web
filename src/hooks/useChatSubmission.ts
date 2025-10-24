import { getAuthToken, isTokenValid } from '@/utils/auth'
import { createMessage, chatMessage, ApiMessage as Message } from '@/api/message'
import { useConversationStore } from '@/store'
import { notification } from 'antd'
import type { NotificationInstance } from 'antd/es/notification/interface'
import { useCallback } from 'react'
/**
 * Guard for authentication and input validation.
 * @param token - Auth token
 * @param val - Message value
 * @param api - Notification API
 * @param loading - Current loading state
 * @returns {boolean} - Whether submission is allowed
 */
const guardSubmission = (
  token: string | null | undefined,
  val: string,
  api: NotificationInstance,
  loading: boolean
): boolean => {
  if (!isTokenValid(token)) {
    api.error({ message: 'Authentication failed, please login again.' })
    return false
  }
  if (!val) {
    return false
  }
  if (loading) {
    api.warning({ message: 'Request is in progress, please wait.' })
    return false
  }
  return true
}

/**
 * Factory for creating message objects.
 * @param id - Message ID
 * @param role - Message role
 * @param parts - Message parts
 * @param status - Message status
 * @param conversationId - Conversation ID
 * @param endTurn - End turn flag
 * @param parent - Parent message ID (optional)
 * @returns {Message} - Formatted message
 */
const createMessageObject = (
  id: string,
  role: 'user' | 'ai',
  parts: string[],
  status: 'success' | 'running' | 'error',
  conversationId: string,
  endTurn: 0 | 1,
  parent?: string,
  contentType?: string
): Message => ({
  id,
  role,
  parts,
  status,
  content_type: contentType ?? 'text' as const,
  conversation_id: conversationId,
  end_turn: endTurn,
  ...(parent && { parent })
})

/**
 * Optimized chat submission hook.
 * Handles message creation, AI response, and state management with error recovery.
 * @returns {Object} - Hook return value
 */
export const useChatSubmission = () => {
  const [api] = notification.useNotification()

  const {
    curConversation,
    loading,
    setLoading,
    addMessage,
    updateMessage,
    setInputValue
  } = useConversationStore()

  const submitMessage = useCallback(
    async (val: string) => {
      if (!curConversation) {
        api.warning({ message: 'No active conversation. Please select one.' })
        return
      }

      const token = getAuthToken()
      if (!guardSubmission(token, val, api, loading)) {
        return
      }

      let userMsgId: string
      const tempAiId = 'temp-ai-' + Date.now() // Unique temporary ID

      try {
        setLoading(true)

        // Create and add user message
        const userMsg = await createMessage({
          conversation_id: curConversation,
          role: 'user',
          status: 'success',
          content_type: 'text',
          parts: [val]
        })

        userMsgId = userMsg.data.id
        addMessage(
          createMessageObject(
            userMsgId,
            'user',
            [val],
            'success',
            curConversation,
            0
          )
        )

        // Add temporary AI message for UX
        addMessage(
          createMessageObject(
            tempAiId,
            'ai',
            ['思考中...'],
            'running',
            curConversation,
            0
          )
        )

        // Call AI API (assuming it triggers response with user input)
        const aiResponse = await chatMessage({
          conversation_id: curConversation,
          role: 'ai',
          status: 'success',
          content_type: 'text',
          parts: [val], // Adjust if API expects different payload
          parent: userMsgId
        })

        // Update AI message with real response
        updateMessage(
          tempAiId,
          createMessageObject(
            aiResponse.data.id,
            'ai',
            aiResponse.data.parts as string[],
            'success',
            curConversation,
            1,
            userMsgId,
            aiResponse.data.content_type
          ),
          false
        )
      } catch (error) {
        // Rollback: Remove temporary AI message on any failure
        updateMessage(tempAiId, null, false) // Remove temp message without DB update

        let errorMsg = 'Message submission failed. Please try again.'
        if (error instanceof Error) {
          // More specific error handling (e.g., network vs auth)
          if (error.message.includes('network')) {
            errorMsg = 'Network error. Check your connection.'
          } else if (error.message.includes('auth')) {
            errorMsg = 'Authentication issue. Please login again.'
          }
        }
        api.error({ message: errorMsg })
      } finally {
        setLoading(false)
        setInputValue('') // Clear input regardless of success/failure
      }
    },
    [curConversation, loading, api, setLoading, addMessage, updateMessage, setInputValue]
  )

  return { submitMessage }
}
