import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
// 定义统一的响应结果接口
export interface ApiResponse<T> {
  data: T
  code: number
  message: string
}
// 创建 axios 实例
const request: AxiosInstance = axios.create({
  baseURL: '/api/v1', // 从环境变量中获取基础 URL
  timeout: 60000 * 3, // 增加请求超时时间为10秒
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在发送请求之前做些什么
    console.log('请求拦截器:', config)
    
    // 可以在这里添加认证 token
    const token = sessionStorage.getItem('access_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 可以添加其他通用请求头
    config.headers['X-Requested-User'] = 'Unknown'
    
    return config
  },
  (error: unknown) => {
    // 对请求错误做些什么
    console.error('请求错误:', error)
    
    // 使用 axios 内置方法判断是否为 AxiosError
    if (axios.isAxiosError(error)) {
      return Promise.reject({
        data: null,
        code: error.response?.status || -1,
        message: error.message || '请求拦截失败'
      } satisfies ApiResponse<null>)
    }
    
    // 其他类型的错误
    const err = error as Error
    return Promise.reject({
      data: null,
      code: -2,
      message: err.message || '未知错误'
    } satisfies ApiResponse<null>)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    // 对响应数据做点什么
    console.log('响应拦截器:', response)

    // 检查响应头中是否有新的 token，如果有则更新本地存储
    const newToken = response.headers['x-new-access-token'] || response.headers['X-New-Access-Token']
    if (newToken) {
      localStorage.setItem('token', newToken)
      console.log('Token 已续期并更新')
    }

    // 检查业务状态码，如果不是 200，则作为错误处理
    const { data } = response
    if (data.code !== 200) {
      const errorResponse: ApiResponse<null> = {
        data: null,
        code: data.code,
        message: data.message || '请求失败'
      }
      return Promise.reject(errorResponse)
    }

    // 返回响应数据
    return response
  },
  (error: unknown) => {
    // 对响应错误做点什么
    console.error('响应错误:', error)
    
    // 使用 axios 内置方法判断是否为 AxiosError
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // 服务器返回了错误状态码
        const { status, data } = error.response
        
        // 构造统一的错误响应格式
        const errorResponse: ApiResponse<null> = {
          data: null,
          code: status,
          message: data?.message || error.message || `请求失败: ${status}`
        }
        
        switch (status) {
          case 401:
            // 未授权，跳转到登录页
            console.error('未授权，请重新登录')
            localStorage.removeItem('token')
            // 这里可以跳转到登录页面，根据实际路由配置调整
            // window.location.href = '/login';
            break
          case 403:
            console.error('拒绝访问')
            break
          case 404:
            console.error('请求的资源不存在')
            break
          case 500:
            console.error('服务器内部错误')
            break
          default:
            console.error(`连接错误 ${status}`)
        }
        
        // 返回统一的错误格式
        return Promise.reject(errorResponse)
      } else if (error.request) {
        // 请求已发出但没有收到响应
        console.error('网络错误:', error.message)
        const data: ApiResponse<null> = {
          data: null,
          code: -1,
          message: '网络错误，请检查您的网络连接'
        }
        return Promise.reject(data)
      }
    }
    
    // 其他错误
    const errorMessage = (error as Error).message || '未知错误'
    console.error('请求配置错误:', errorMessage)
    return Promise.reject({
      data: null,
      code: -2,
      message: errorMessage
    } satisfies ApiResponse<null>)
  }
)



// 导出请求方法的封装
export const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await request.get<ApiResponse<T>>(url, config)
    return response.data
  },
  post: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await request.post<ApiResponse<T>>(url, data, config)
    return response.data
  },
  put: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await request.put<ApiResponse<T>>(url, data, config)
    return response.data
  },
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await request.delete<ApiResponse<T>>(url, config)
    return response.data
  },
  patch: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await request.patch<ApiResponse<T>>(url, data, config)
    return response.data
  }
}

export default request

// 导出类型定义
export type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig }