import axios from 'axios'
import { getAuthToken } from '@/utils/auth'
import { ApiResponse,Report } from './types'

const api = axios.create({
  baseURL: '/ai-api',
  timeout: 600000,
  headers: {
    Authorization: getAuthToken()
  }
})


export interface ReportResponse {
  reports: Report[]
  total: number
  skip: number
  limit: number
  has_more: boolean
}
export interface ReportQueryParams {
  start_date: string
  end_date: string
}

/**
 * getReports
 * @param params 查询参数
 * @returns {Promise<ApiResponse<ReportResponse>>}
 */
export const getReports = async (params: ReportQueryParams): Promise<ApiResponse<ReportResponse>> => {
  const { data } = await api.get<ApiResponse<ReportResponse>>(
    '/api/daily-reports',
    {
      params
    }
  )
  return data
}

interface ReportContent {
    document_id: string
    content: string
}
/**
 * getReportContent
 * @param id 
 * @returns  {Promise<ApiResponse<ReportContent>>}
 */
export const getReportContent = async (id: string): Promise<ApiResponse<ReportContent>> => {
    const { data } = await api.get<ApiResponse<ReportContent>>(
        `/api/dify/documents/${id}/content`
    )
    return data
}

/**
 * postDailySummary
 * @param content 内容
 * @returns {Promise<ApiResponse<unknown>>}
 */
export const postDailySummary = async (content: string): Promise<ApiResponse<unknown>> => {
    const { data } = await api.post<ApiResponse<unknown>>('/api/daily-summary',
        { content }
    )
    return data
}