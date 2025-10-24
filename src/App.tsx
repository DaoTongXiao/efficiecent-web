import Layout from '@/layout/Layout'
import { XProvider } from '@ant-design/x'
import { useInitializeUserData } from '@/hooks/useUserInfoAction'
import { useEffect } from 'react'
import {
  ConfigProvider,
  App as AppProvider,
  Skeleton,
  notification  // 导入 notification 以使用 hook
} from 'antd'
import zhCN from 'antd/locale/zh_CN'
import '@/style/app.scss'

/**
 * Application entry point
 * @returns App 组件
 */
const App: React.FC = () => {
  sessionStorage.setItem('ticket', 'sk-gubo-test-token')
  const { initUserInfo, loading } = useInitializeUserData()
  
  // 使用 hook 获取 api 和 contextHolder
  // 这在 render 中调用是安全的，因为它只注册上下文，不触发副作用
  const [api, contextHolder] = notification.useNotification()
  
  const theme = {
    token: {
      colorPrimary: '#5d2dcd'
    }
  }
  /**
   * 初始化数据
   */
  const initializeData = async () => {
    try {
      const message = await initUserInfo()
      if (!message.success) {
        // 在 effect 中使用 api，确保 post-render 触发
        api.error({
          message: message.message,
          duration: 3,
          placement: 'topRight'
        })
      }
    } catch (error) {
      console.error('Initialization failed:', error)
      api.error({
        message: '初始化数据失败，请重试',
        duration: 3
      })
    }
  }

  useEffect(() => {
    initializeData()
  }, [])  // 依赖空数组，只初始化一次

  return (
    <ConfigProvider locale={zhCN} componentSize="middle" theme={theme}>
      {/* antdx 全局配置 */}
      <XProvider theme={theme} componentSize="middle">
        {/* 全局提示：将 contextHolder 渲染在这里，确保它消费 ConfigProvider 上下文 */}
        <AppProvider>
          {contextHolder}  {/* Notification 的 holder，必须渲染 */}
          {loading ? <Skeleton /> : <Layout />}
        </AppProvider>
      </XProvider>
    </ConfigProvider>
  )
}

export default App
