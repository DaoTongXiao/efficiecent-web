import axios from 'axios'
import { getAuthToken } from '@/utils/auth'
import { ApiResponse } from './types'
import { OneDataApiResponse } from './onedata'

const api = axios.create({
  baseURL: '/ai-api',
  timeout: 600000,
  headers: {
    Authorization: getAuthToken(),
    'Content-Type': 'application/json'
  }
})


/**
 * getUserInfo
 * @returns {Promise<ApiResponse>}
 */
export const getUserInfo = async (): Promise<ApiResponse<{
    user_id: string
    user_name: string
}>> => {
    const { data } = await api.get<ApiResponse<{
    user_id: string
    user_name: string
}>>('/userinfo')
    return data
}

interface UserMapping {
    mapping_id: string
}

interface RequestUserMapping {
    user_id: string|number
    user_name: string | null
}

/**
 * getUserMapping
 * @param info 
 * @returns {Promise<UserMapping>}
 */
export const getUserMapping = async (info: RequestUserMapping): Promise<UserMapping> => {
    const { data } = await api<ApiResponse<UserMapping>>({
        method: 'POST',
        url: '/api/user-mapping',
        data: info
    })
    return data.data
}