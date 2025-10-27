import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import dayjs from 'dayjs'
import type { MessageType, Conversation } from '@/types/typing'
import type { ConversationMeta } from '@/api/conversion/conversion'
import {
  createConversation,
  getConversations,
  getConversation,
  deleteConversation,
  updateConversation
} from '@/api/conversion/conversion'
import { apiUpdateMessage, type ApiMessage } from '@/api/conversion/message'

// 缺失接口定义（基于代码推断，可移到 types 文件）
interface ApiResponse<T = unknown> {
  code: number
  msg?: string
  data: T
}

interface ApiConversation {
  id: string
  title: string
  create_time: string // ISO string
}

interface ApiConversationsResponse {
  conversations: ApiConversation[]
}


// 计算对话分组
const getConversationGroup = (createTime: string | dayjs.Dayjs): string => {
  const date = dayjs(createTime)
  const now = dayjs()
  if (date.isSame(now, 'day')) return '今天'
  if (date.isSame(now.subtract(1, 'day'), 'day')) return '前一天'
  if (date.isAfter(now.subtract(7, 'day'))) return '过去一周'
  return '更早'
}

// Mapper: API 数据转前端 Conversation 格式
const mapToConversations = (apiConvs: ApiConversation[]): Conversation[] =>
  apiConvs.map((conv) => ({
    key: conv.id,
    label: conv.title,
    group: getConversationGroup(conv.create_time)
  }))

// 辅助：计算变更字段（浅比较，避免深 stringify）
const getChangedFields = (oldObj: ApiMessage, newObj: ApiMessage): Partial<ApiMessage> => {
  const changes: Record<string, unknown> = {}
  const keys = Object.keys(newObj) as (keyof ApiMessage)[]

  for (const key of keys) {
    const oldVal = oldObj[key]
    const newVal = newObj[key]

    if (Array.isArray(oldVal) && Array.isArray(newVal)) {
      // 简单数组比较（浅，假设 parts 是 string[]）
      if (
        oldVal.length !== newVal.length ||
        oldVal.some((item, idx) => String(item) !== String(newVal[idx]))
      ) {
        changes[key] = newVal
      }
    } else if (oldVal !== newVal) {
      // Primitive 或 null/undefined 比较
      changes[key] = newVal
    }
    // 忽略深 object（假设 ApiMessage 无深嵌套；若有，递归实现）
  }
  return changes as Partial<ApiMessage>
}

// 高阶：包装 API 调用，严格类型化
const withApiHandler = (set: (fn: (state: ConversationState) => void) => void) =>
  async <T>(
    apiCall: () => Promise<ApiResponse<T>>,
    onSuccess: (data: T) => void,
    errorMapper?: (error: unknown) => string
  ): Promise<void> => {
    try {
      set((state) => {
        state.apiLoading = true
        state.apiError = null
      })
      const response = await apiCall()
      if (response.code !== 200) {
        const msg = response.msg || 'API 请求失败'
        set((state) => {
          state.apiError = msg
        })
        throw new Error(msg)
      }
      onSuccess(response.data)
    } catch (error) {
      const msg = errorMapper
        ? errorMapper(error)
        : error instanceof Error
        ? error.message
        : '操作失败'
      set((state) => {
        state.apiError = msg
      })
    } finally {
      set((state) => {
        state.apiLoading = false
      })
    }
  }

// Store 类型（完整，无变化）
export type ConversationState = {
  messages: MessageType[]
  conversations: Conversation[]
  curConversation: string
  inputValue: string
  loading: boolean
  apiLoading: boolean
  apiError: string | null

  // Actions
  setMessages: (messages: MessageType[]) => void
  setConversations: (conversations: Conversation[]) => void
  setCurConversation: (key: string) => void
  setInputValue: (value: string) => void
  setLoading: (loading: boolean) => void
  setApiLoading: (loading: boolean) => void
  setApiError: (error: string | null) => void

  addMessage: (message: MessageType) => void
  updateMessage: (id: string, message: MessageType | null, syncToDb?: boolean) => Promise<void>
  clearMessages: () => void
  switchConversation: (key: string) => void

  // API 方法
  fetchConversations: (params?: {
    user_id: string | number
    skip?: number
    limit?: number
    order_by?: string
    order_desc?: boolean
  }) => Promise<void>
  createConversationAsync: (conversationData: ConversationMeta) => Promise<void>
  deleteConversationAsync: (conversationId: string) => Promise<void>
  updateConversationAsync: (conversationId: string, title: string) => Promise<void>
  getConversationAsync: (conversationId: string) => Promise<void>
  initializeConversations: (user_id: string | number | null) => Promise<void>
}

const useConversationStore = create<ConversationState>()(
  immer((set, get) => {
    const apiHandler = withApiHandler(set)

    return {
      messages: [],
      conversations: [],
      curConversation: '',
      inputValue: '',
      loading: false,
      apiLoading: false,
      apiError: null,

      setMessages: (messages) => set({ messages }),
      setConversations: (conversations) => set({ conversations }),
      setCurConversation: (curConversation) => set({ curConversation }),
      setInputValue: (inputValue) => set({ inputValue }),
      setLoading: (loading) => set({ loading }),
      setApiLoading: (apiLoading) => set({ apiLoading }),
      setApiError: (apiError) => set({ apiError }),

      addMessage: (message) => {
        set((state) => {
          state.messages.push({...message,create_time: new Date().toISOString()})
          if (state.messages.length === 1) {
            const titleContent = message.parts[0]
            if (typeof titleContent === 'string') {
              const newTitle =
                titleContent.length > 20 ? titleContent.substring(0, 20) + '...' : titleContent
              get().updateConversationAsync(message.conversation_id, newTitle).catch(() => {
                // 静默失败，标题更新非关键
              })
            }
          }
        })
      },

      updateMessage: async (id, message, syncToDb = false) => {
        const state = get()
        const index = state.messages.findIndex((item) => item.id === id)
        if (index === -1) return

        set((state) => {
          if (message === null) {
            state.messages.splice(index, 1)
            return
          }
          state.messages[index] = { ...message, create_time: new Date().toISOString() }
        })

        if (syncToDb && message !== null) {
          const oldMessage = state.messages[index] as ApiMessage // 假设 MessageType 兼容 ApiMessage
          const changes = getChangedFields(oldMessage, message as ApiMessage)
          if (Object.keys(changes).length > 0) {
            await apiUpdateMessage(id, changes)
          }
        }
      },

      clearMessages: () => set({ messages: [] }),

      switchConversation: (key) => {
        const { conversations } = get()
        if (!conversations.some((conv) => conv.key === key)) {
          return // 静默忽略
        }
        set({ curConversation: key })
      },

      fetchConversations: async (params) => {
        await apiHandler(
          () => params?.user_id ? getConversations(params) : getConversations(),
          (data: ApiConversationsResponse) => {
            set({ conversations: mapToConversations(data.conversations) })
          }
        )
      },

      createConversationAsync: async (conversationData) => {
        await apiHandler(
          () => createConversation(conversationData),
          (data: { id: string; title: string; create_time: string | number }) => {
            const newConv: Conversation = {
              key: data.id,
              label: data.title,
              group: getConversationGroup(String(data.create_time))
            }
            set((state) => {
              state.conversations.unshift(newConv)
              state.curConversation = data.id
            })
            // 创建新对话后立即加载该对话的消息内容
            get().getConversationAsync(data.id).catch((error) => {
              console.error('Failed to load new conversation messages:', error)
            })
          }
        )
      },

      deleteConversationAsync: async (conversationId) => {
        const prevState = get()
        const prevConversations = [...prevState.conversations] // 备份
        set((state) => {
          state.conversations = state.conversations.filter((conv: Conversation) => conv.key !== conversationId)
        })

        try {
          await apiHandler(() => deleteConversation(conversationId), () => {})
          // 成功：切换逻辑在组件中处理（基于 curConversation 变化）
        } catch {
          // 回滚
          set({ conversations: prevConversations })
          throw new Error('删除失败，回滚状态')
        }
      },

      updateConversationAsync: async (conversationId, title) => {
        const prevConversations = [...get().conversations]
        set((state) => {
          const index = state.conversations.findIndex((conv: Conversation) => conv.key === conversationId)
          if (index !== -1) {
            state.conversations[index] = { ...state.conversations[index], label: title }
          }
        })

        try {
          await updateConversation(conversationId, { title })
        } catch {
          // 回滚
          set({ conversations: prevConversations })
          throw new Error('更新失败，回滚状态')
        }
      },

      getConversationAsync: async (conversationId) => {
        set({ loading: true, apiError: null })
        try {
          const response = await getConversation(conversationId)
          if (response.code === 200) {
            set({ messages: response.data.messages || [] })
          } else {
            throw new Error(response.msg || '加载对话失败')
          }
        } catch (error) {
          const msg = error instanceof Error ? error.message : '加载失败'
          set({ apiError: msg })
          set({ messages: [] })
        } finally {
          set({ loading: false })
        }
      },

      initializeConversations: async (user_id) => {
        const params = {
          user_id: user_id ? String(user_id) : '',
          order_by: 'create_time',
          limit: 100,
          order_desc: true
        } as const
        await get().fetchConversations(params)

        const { conversations, curConversation } = get()
        if (
          conversations.length > 0 &&
          (!curConversation || !conversations.some((c) => c.key === curConversation))
        ) {
          get().switchConversation(conversations[0].key)
          // 加载第一个对话的消息
          await get().getConversationAsync(conversations[0].key)
        }
      }
    }
  })
)

export default useConversationStore
