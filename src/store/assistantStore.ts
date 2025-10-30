import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { Assistant, AssistantRequest, createAssistant, listAssistants, getAssistantById, updateAssistant, deleteAssistant, searchAssistants } from '@/api/assistants'
import { ApiResponse } from '@/api/request'

export interface AssistantState {
  assistants: Assistant[]
  curAssistant: Assistant | null
  loading: boolean
  apiLoading: boolean
  apiError: string | null

  // Actions
  setAssistants: (assistants: Assistant[]) => void
  setCurAssistant: (assistant: Assistant | null) => void
  setLoading: (loading: boolean) => void
  setApiLoading: (loading: boolean) => void
  setApiError: (error: string | null) => void

  // API Methods
  fetchAssistants: () => Promise<void>
  createAssistantAsync: (assistantData: AssistantRequest) => Promise<void>
  updateAssistantAsync: (assistantId: string, assistantData: AssistantRequest) => Promise<void>
  deleteAssistantAsync: (assistantId: string) => Promise<void>
  getAssistantByIdAsync: (assistantId: string) => Promise<void>
  searchAssistantsAsync: (name: string) => Promise<void>
}

const useAssistantStore = create<AssistantState>()(
  immer((set, get) => {
    // 高阶：包装 API 调用，严格类型化
    const withApiHandler = async <T>(
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
          const msg = response.message || 'API 请求失败'
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

    return {
      assistants: [],
      curAssistant: null,
      loading: false,
      apiLoading: false,
      apiError: null,

      setAssistants: (assistants) => set({ assistants }),
      setCurAssistant: (curAssistant) => set({ curAssistant }),
      setLoading: (loading) => set({ loading }),
      setApiLoading: (loading) => set({ loading }),
      setApiError: (apiError) => set({ apiError }),

      fetchAssistants: async () => {
        await withApiHandler(
          () => listAssistants(),
          (data) => {
            const assistants = Array.isArray(data) ? data : data.assistants || []
            set({ assistants, curAssistant: assistants.length > 0 ? assistants[0] : null })
          }
        )
      },

      createAssistantAsync: async (assistantData) => {
        await withApiHandler(
          () => createAssistant(assistantData),
          (data: Assistant) => {
            set((state) => {
              state.assistants.push(data)
              state.curAssistant = data
            })
          }
        )
      },

      updateAssistantAsync: async (assistantId, assistantData) => {
        const prevAssistants = [...get().assistants]
        const prevCurAssistant = get().curAssistant

        // 先更新本地状态
        set((state) => {
          const index = state.assistants.findIndex((a) => a.id === assistantId)
          if (index !== -1) {
            state.assistants[index] = { ...state.assistants[index], ...assistantData }
            if (state.curAssistant && state.curAssistant.id === assistantId) {
              state.curAssistant = { ...state.curAssistant, ...assistantData }
            }
          }
        })

        try {
          // 调用API更新
          await withApiHandler(
            () => updateAssistant(assistantId, assistantData),
            () => {} // 成功时不需要额外处理，因为本地状态已经更新
          )
        } catch {
          // 如果API调用失败，回滚状态
          set({ assistants: prevAssistants, curAssistant: prevCurAssistant })
          throw new Error('更新助手失败，已回滚状态')
        }
      },

      deleteAssistantAsync: async (assistantId) => {
        const prevAssistants = [...get().assistants]
        set((state) => {
          state.assistants = state.assistants.filter((a) => a.id !== assistantId)
          if (state.curAssistant && state.curAssistant.id === assistantId) {
            state.curAssistant = null
          }
        })

        try {
          await withApiHandler(
            () => deleteAssistant(assistantId),
            () => {}
          )
        } catch {
          // 如果API调用失败，回滚状态
          set({ assistants: prevAssistants })
          throw new Error('删除助手失败，已回滚状态')
        }
      },

      getAssistantByIdAsync: async (assistantId) => {
        set({ loading: true, apiError: null })
        try {
          const response = await getAssistantById(assistantId)
          if (response.code === 200) {
            set({ curAssistant: response.data })
          } else {
            throw new Error(response.message || '加载助手失败')
          }
        } catch (error) {
          const msg = error instanceof Error ? error.message : '加载助手失败'
          set({ apiError: msg })
        } finally {
          set({ loading: false })
        }
      },

      searchAssistantsAsync: async (name) => {
        await withApiHandler(
          () => searchAssistants(name),
          (data) => {
            const assistants = Array.isArray(data) ? data : data.assistants || []
            set({ assistants })
          }
        )
      }
    }
  })
)

export default useAssistantStore