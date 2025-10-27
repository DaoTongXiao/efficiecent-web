import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { Knowledge, KnowledgeRequest, createKnowledge, listKnowledges, getKnowledgeById, updateKnowledge, deleteKnowledge, searchKnowledges } from '@/api/knowledges'
import { ApiResponse } from '@/api/request'

export interface KnowledgeState {
  knowledges: Knowledge[]
  curKnowledge: Knowledge | null
  loading: boolean
  apiLoading: boolean
  apiError: string | null

  // Actions
  setKnowledges: (knowledges: Knowledge[]) => void
  setCurKnowledge: (knowledge: Knowledge | null) => void
  setLoading: (loading: boolean) => void
  setApiLoading: (loading: boolean) => void
  setApiError: (error: string | null) => void

  // API Methods
  fetchKnowledges: () => Promise<void>
  createKnowledgeAsync: (knowledgeData: KnowledgeRequest) => Promise<void>
  updateKnowledgeAsync: (knowledgeId: string, knowledgeData: KnowledgeRequest) => Promise<void>
  deleteKnowledgeAsync: (knowledgeId: string) => Promise<void>
  getKnowledgeByIdAsync: (knowledgeId: string) => Promise<void>
  searchKnowledgesAsync: (name: string) => Promise<void>
}

const useKnowledgeStore = create<KnowledgeState>()(
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
      knowledges: [],
      curKnowledge: null,
      loading: false,
      apiLoading: false,
      apiError: null,

      setKnowledges: (knowledges) => set({ knowledges }),
      setCurKnowledge: (curKnowledge) => set({ curKnowledge }),
      setLoading: (loading) => set({ loading }),
      setApiLoading: (loading) => set({ loading }),
      setApiError: (apiError) => set({ apiError }),

      fetchKnowledges: async () => {
        await withApiHandler(
          () => listKnowledges(),
          (data) => {
            // console.log('knowledges:', data)
            const knowledges = Array.isArray(data) ? data : data.knowledges || []
            set({ knowledges })
          }
        )
      },

      createKnowledgeAsync: async (knowledgeData) => {
        await withApiHandler(
          () => createKnowledge(knowledgeData),
          (data: Knowledge) => {
            set((state) => {
              state.knowledges.push(data)
              state.curKnowledge = data
            })
          }
        )
      },

      updateKnowledgeAsync: async (knowledgeId, knowledgeData) => {
        const prevKnowledges = [...get().knowledges]
        const prevCurKnowledge = get().curKnowledge
        
        // 先更新本地状态
        set((state) => {
          const index = state.knowledges.findIndex((k) => k.id === knowledgeId)
          if (index !== -1) {
            state.knowledges[index] = { ...state.knowledges[index], ...knowledgeData }
            if (state.curKnowledge && state.curKnowledge.id === knowledgeId) {
              state.curKnowledge = { ...state.curKnowledge, ...knowledgeData }
            }
          }
        })

        try {
          // 调用API更新
          await withApiHandler(
            () => updateKnowledge(knowledgeId, knowledgeData),
            () => {} // 成功时不需要额外处理，因为本地状态已经更新
          )
        } catch {
          // 如果API调用失败，回滚状态
          set({ knowledges: prevKnowledges, curKnowledge: prevCurKnowledge })
          throw new Error('更新知识库失败，已回滚状态')
        }
      },

      deleteKnowledgeAsync: async (knowledgeId) => {
        const prevKnowledges = [...get().knowledges]
        set((state) => {
          state.knowledges = state.knowledges.filter((k) => k.id !== knowledgeId)
          if (state.curKnowledge && state.curKnowledge.id === knowledgeId) {
            state.curKnowledge = null
          }
        })

        try {
          await withApiHandler(
            () => deleteKnowledge(knowledgeId),
            () => {}
          )
        } catch {
          // 如果API调用失败，回滚状态
          set({ knowledges: prevKnowledges })
          throw new Error('删除知识库失败，已回滚状态')
        }
      },

      getKnowledgeByIdAsync: async (knowledgeId) => {
        set({ loading: true, apiError: null })
        try {
          const response = await getKnowledgeById(knowledgeId)
          if (response.code === 200) {
            set({ curKnowledge: response.data })
          } else {
            throw new Error(response.message || '加载知识库失败')
          }
        } catch (error) {
          const msg = error instanceof Error ? error.message : '加载知识库失败'
          set({ apiError: msg })
        } finally {
          set({ loading: false })
        }
      },

      searchKnowledgesAsync: async (name) => {
        await withApiHandler(
          () => searchKnowledges(name),
          (data) => {
            const knowledges = Array.isArray(data) ? data : data.knowledges || []
            set({ knowledges })
          }
        )
      }
    }
  })
)

export default useKnowledgeStore