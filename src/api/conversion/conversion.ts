import axios from 'axios'
import { getAuthToken } from '@/utils/auth'
import { ApiResponse } from '../types'
import { ApiMessage } from './message'

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 600000,
  headers: {
    Authorization: getAuthToken()
  }
})


export interface UserMeta {
    user_id: string | number
    user_name: string | number
    prompt: string
    business_id: string | number
}

export interface ConversationMeta {
    title: string
    user_meta: UserMeta
}

export interface Conversation {
    id: string
    title: string
    user_id: string
    created_at: string
    updated_at: string
    is_archived: boolean
    is_starred: boolean
    message_count: number
    last_message_time: string
    create_time: string
    update_time: string
    is_active: boolean
}

export interface ConversationsResponse {
    conversations: Conversation[]
    total: number
    skip: number
    limit: number
    has_more: boolean
}

interface ConversationResponse {
    id: string
    title: string
    user_id: string
    create_time: string | number
}
/**
 * create conversation
 * @param requestData
 * @returns {Promise<ApiResponse<ConversationResponse>piResponse>}
 */
export const createConversation = async (requestData: ConversationMeta): Promise<ApiResponse<ConversationResponse>> => {
    const { data } = await api<ApiResponse<ConversationResponse>>({
        method: 'POST',
        url: '/conversations',
        headers: {
            'Content-Type': 'application/json'
        },
        data: requestData
    })
    return data
}

/**
 * 获取 conversation 列表
 * @param params 查询参数
 * @returns {Promise<ApiResponse<ConversationsResponse>>}
 */
export const getConversations = async (params?: {
    user_id: string|number
    skip?: number
    limit?: number
    order_by?: string
    order_desc?: boolean
}) => {
    const { data } = await api<ApiResponse<ConversationsResponse>>({
        method: 'GET',
        url: '/conversations',
        params
    })
    return data
}

export interface ConversationQueryResponse {
    conversation_id: string
    messages: ApiMessage[]
}

/**
 * 获取单个 conversation
 * @param id conversation ID
 * @returns {Promise<ApiResponse<ConversationQueryResponse>>}
 */
export const getConversation = async (id: string) => {
    const { data } = await api<ApiResponse<ConversationQueryResponse>>({
        method: 'GET',
        url: `/conversations/${id}`
    })
    return data
}


/**
 * 删除 conversation
 * @param id conversation ID
 * @returns {Promise<ApiResponse>}
 */
export const deleteConversation = async (id: string) => {
    const { data } = await api<ApiResponse>({
        method: 'DELETE',
        url: `/conversations/${id}`
    })
    return data
}

/**
 * updateConversation
 * @param id 
 * @param data 
 */
export const updateConversation = async (id: string, data: Partial<ConversationMeta>) => {
    await api<ApiResponse>({
        method: 'PUT',
        url: `/conversations/${id}`,
        data
    })
}