import { getUserInfo, getUserMapping } from '@/api/user'
import { useUserStore } from '@/store'
import { getAuthToken } from '@/utils/auth'
import { useRequest } from 'ahooks'

/**
 * useInitializeUserData - 用户部分
 */
export const useInitializeUserData = () => { 
  const { setToken, setInfo } = useUserStore()

  // 处理用户信息的独立函数
  // 类型注解：明确返回 Promise<{ success: boolean; message?: string }>
  const handleUserInfo = async (token: string): Promise<{ success: boolean; message?: string }> => {
    // 先设置 token，确保后续 API 调用可用（假设 API 依赖全局 token）
    setToken(token)

    try {
      const { data: userInfoRes } = await getUserInfo()
       console.log('用户信息:', userInfoRes)
      if (userInfoRes) {
        console.log('用户信息:', userInfoRes)
        // 获取用户映射
        const user_mapping = await getUserMapping({
          user_id: userInfoRes.user_id?.toString(),
          user_name: userInfoRes.user_name
        })
        setInfo({
          user_id: user_mapping.mapping_id,
          user_name: userInfoRes.user_name,
          company_code: 'guwave',
          business_id: userInfoRes.user_id?.toString()
        })
        return { success: true }
      } else {
        return { success: false, message: '获取用户信息失败' }
      }
    } catch (error) {
      console.error('用户信息初始化错误:', error)
      return { success: false, message: '获取用户信息失败，请检查网络或 token' }
    }
  }

  const { loading, runAsync } = useRequest(handleUserInfo, { manual: true })

  /**
   * initUserInfo
   * 初始化用户信息
   * @returns {Promise<{success: boolean; message?: string}>}
   */
  const initUserInfo = async (): Promise<{ success: boolean; message?: string }> => {
    // 按照优先级从不同来源获取 token
    const token = getAuthToken() || new URLSearchParams(window.location.search).get('token')
    console.log('token:', token)  
    // 如果存在 token，则执行数据获取
    if (token) {
      // 关键修复：使用 await 获取 run 的 resolve 值
      const result = await runAsync(token)
      return result
    } else {
      return { success: false, message: '请先登录' }
    }
  }

  return {
    loading,
    initUserInfo
  }
}
