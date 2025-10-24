import axios from 'axios'
import { getAuthToken } from '@/utils/auth'
const api = axios.create({
  baseURL: '/ai-api',
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
 * batchOverview
 * @param request 
 * @returns 
 */
export const batchOverview = async (request: ToolRequestMeta): Promise<ToolResonse> => {
  const response = await api.post<ToolResonse>('/v1/batch/overview', request)
  return response.data
}

/**
 * wafermapConfig
 * @param request 
 * @returns 
 */
export const wafermapConfig = async (request: ToolRequestMeta): Promise<ToolResonse> => {
  const response = await api.post<ToolResonse>('/v1/wafermap/config', request)
  return response.data
}

/**
 * productStatus
 * @param request 
 * @returns 
 */
export const productStatus = async (request: ToolRequestMeta): Promise<ToolResonse> => {
  const response = await api.post<ToolResonse>('/v1/product/status', request)
  return response.data
}

/**
 * 获取device列表
 * @returns
 */
export const getDeviceList = async () => {
  const { data } = await api.post<DeviceResponse>('/device')
  return data
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




