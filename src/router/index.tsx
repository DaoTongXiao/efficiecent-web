import { lazy } from 'react'
import { createHashRouter, Navigate } from 'react-router-dom'
import Layout from '@/layout/Layout'
import { Suspense } from 'react'

// 懒加载页面组件
const ChatPage = lazy(() => import('@/pages/chat'))

/**
 * 创建路由器配置
 */
export const router = createHashRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      {
        index: true,
        Component: () => <Navigate to="/chat" replace />
      },
      {
        path: 'chat',
        Component: () => (
          <Suspense fallback={<div>Loading...</div>}>
            <ChatPage />
          </Suspense>
        )
      },
      {
        path: 'ai-web',
        Component: () => <Navigate to="/chat" replace />
      }
    ]
  }
])

// 导出默认路由器
export default router
