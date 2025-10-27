import { api }from '@/api/request'
import { ApiResponse } from '@/api/request'

export interface Knowledge {
    id: string;
    name: string;
    description: string;
}

export interface KnowledgeRequest {
    name: string;
    description: string;
    created_by: string;
    updated_by: string;
}
 
// 创建知识
export const createKnowledge = async (data: KnowledgeRequest): Promise<ApiResponse<Knowledge>> => {
  return api.post<Knowledge>('/knowledges', data)
}

interface KnowledgeResponse {
    knowledges: Knowledge[];
    total: number;
    skip: number;
    limit: number;
}
// 获取知识列表
export const listKnowledges = async (): Promise<ApiResponse<KnowledgeResponse>> => {
  return api.get<KnowledgeResponse>('/knowledges', {
    params: {
        skip: 0,
        limit: 100
    }
  })
}

// 根据 ID 获取知识详情
export const getKnowledgeById = async (knowledgeId: string): Promise<ApiResponse<Knowledge>> => {
  return api.get<Knowledge>(`/knowledges/${knowledgeId}`)
}

// 更新知识
export const updateKnowledge = async (
  knowledgeId: string,
  data: KnowledgeRequest
): Promise<ApiResponse<Knowledge>> => {
  return api.put<Knowledge>(`/knowledges/${knowledgeId}`, data)
}

// 删除知识
export const deleteKnowledge = async (knowledgeId: string): Promise<ApiResponse<void>> => {
  return api.delete(`/knowledges/${knowledgeId}`)
}

// 搜索知识
export const searchKnowledges = async (name: string): Promise<ApiResponse<KnowledgeResponse>> => {
  return api.get<KnowledgeResponse>('/knowledges/search', {
    params: {
        name: name,
        limit: 100
    }
  })
}

