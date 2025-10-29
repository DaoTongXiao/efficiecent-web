
import axios from 'axios'
import { getAuthToken } from '@/utils/auth'
import { ApiResponse, Report } from '../types'

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 600000,
  headers: {
    Authorization: getAuthToken()
  }
})

export interface ToolPart {
    category: string
    body: string
}

type Parts =  string[] | Report[] | ToolPart[]; 

export interface ApiMessage {
  id: string;     
  knowledge_id?: string               
  conversation_id: string;           // 会话 ID
  role: string;                      // 作者角色
  name?: string;                     // 作者名称
  author_metadata?: {
    [key: string]: string;
  };             // 作者元数据 (JSON)
  create_time?: string;                // 创建时间
  update_time?: string;                // 更新时间
  content_type: string;              // 内容类型
  parts:  Parts;                     // 内容部分 (JSON)
  status: string;                    // 消息状态
  end_turn: 0 | 1;                   // 是否结束会话 (0:否, 1:是)
  weight?: number;                   // 消息权重
  message_metadata?: {
    [key: string]: string | number;
  };            // 消息元数据 (JSON)
  recipient?: string;                // 接收者
  channel?: string;                  // 频道
  parent?: string;                   // 父消息 ID
  children?: string[]                 // 子消息 ID 列表 (JSON)
}

export interface CreateMessage {
  conversation_id: string;           // 会话 ID
  knowledge_id?: string   
  role: string;                      // 作者角色
  name?: string;                     // 作者名称
  author_metadata?: {
    [key: string]: string;
  }; 
  status: string;
  content_type: string;              // 内容类型
  parts: Parts;                   // 内容部分 (JSON)
  weight?: number;                   // 消息权重
  message_metadata?: {
    [ke: string]: string | number;
  };          
  parent?: string;                   // 父消息 ID
}

/**
 * createMessage
 * @param request 
 * @returns {ApiResponse<ApiMessage>}
 */
export const createMessage = async (request: CreateMessage): Promise<ApiResponse<ApiMessage>> => { 
    const { data } = await api.post<ApiResponse<ApiMessage>>('/messages', request)
    return data
} 

/**
 * chatMessage
 * @param query 
 * @returns 
 */
export const chatMessage = async (request: CreateMessage): Promise<ApiResponse<ApiMessage>> => {
    const { data } = await api.post<ApiResponse<ApiMessage>>('/invoke', request)
    return data
}

/**
 * updateMessage
 * @param id 
 * @param request 
 * @returns {ApiResponse<ApiMessage>}
 */
export const apiUpdateMessage = async (id: string, request:Partial<ApiMessage> ): Promise<ApiResponse<ApiMessage>> => {
  const { data } = await api.put<ApiResponse<ApiMessage>>(`/messages/${id}`, request)
  return data
}