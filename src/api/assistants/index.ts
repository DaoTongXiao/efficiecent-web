import { api } from '@/api/request'
import { ApiResponse } from '@/api/request'
import { Assistant, AssistantRequest } from '@/api/types'

// 重新导出类型
export type { Assistant, AssistantRequest }

// 创建助手
export const createAssistant = async (data: AssistantRequest): Promise<ApiResponse<Assistant>> => {
  return api.post<Assistant>('/assistants', data)
}

interface AssistantResponse {
  assistants: Assistant[];
  total: number;
  skip: number;
  limit: number;
}

// 获取助手列表
export const listAssistants = async (): Promise<ApiResponse<AssistantResponse>> => {
  return api.get<AssistantResponse>('/assistants', {
    params: {
      skip: 0,
      limit: 100
    }
  })
}

// 根据 ID 获取助手详情
export const getAssistantById = async (assistantId: string): Promise<ApiResponse<Assistant>> => {
  return api.get<Assistant>(`/assistants/${assistantId}`)
}

// 更新助手
export const updateAssistant = async (
  assistantId: string,
  data: AssistantRequest
): Promise<ApiResponse<Assistant>> => {
  return api.put<Assistant>(`/assistants/${assistantId}`, data)
}

// 删除助手
export const deleteAssistant = async (assistantId: string): Promise<ApiResponse<void>> => {
  return api.delete(`/assistants/${assistantId}`)
}

// 搜索助手
export const searchAssistants = async (name: string): Promise<ApiResponse<AssistantResponse>> => {
  return api.get<AssistantResponse>('/assistants/search', {
    params: {
      name: name,
      limit: 100
    }
  })
}