import axios from 'axios'
import { getAuthToken } from '@/utils/auth'
const api = axios.create({
  baseURL: '/api/v1',
  timeout: 600000,
  headers: {
    Authorization: getAuthToken()
  }
})

export interface ChatRequest {
  query: string
  image_path?: string
  system_message?: string
  model_id?: string
  attachment?: string
}


export interface StreamData {
  type: 'search' | 'chat'
  data: unknown
  done?: boolean
}

export interface DeviceResponse {
  code: number
  msg: string
  data: string[]
}

/**
 * ToolRequestMeta 接口
 * 注意：至少需要提供一个字段的值，不能所有字段都为空
 */
export interface ToolRequestMeta{
  prompt: string
  device_id: string
  lot_ids?: string
  wafer_ids?: string
  date_start: string
  date_end: string
  attachment?: string
}

export interface ToolResonse {
  code: number
  data: {
    category: string
    body: string
  }[]
  msg: string
}



/**
 * 文件上传
 */

export const uploafFile = async (file: File): Promise<string> => {
try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await api.post<{
        status: string
        message: string
        file_path: string
      }>('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      return response.data?.file_path
    } catch (error) {
      console.error('上传失败：', error)
      throw error
    }
  }




