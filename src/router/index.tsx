import { lazy } from 'react'
import { createHashRouter, Navigate } from 'react-router-dom'
import Layout from '@/layout/Layout'
import ChatPage from '@/pages/chat'
import { Suspense } from 'react'

// 懒加载页面组件
const AssistantsPage = lazy(() => import('@/pages/chat/sub/AssistantsPage'))
const ConversationsPage = lazy(
  () => import('@/pages/chat/sub/ConversationsPage')
)
const SettingsPage = lazy(() => import('@/pages/chat/sub/SettingsPage'))

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
        Component: () => <Navigate to="/chat/conversations" replace />
      },
      {
        path: 'chat',
        Component: ChatPage,
        children: [
          {
            index: true,
            Component: () => <Navigate to="conversations" replace />
          },
          {
            path: 'conversations',
            Component: () => (
              <Suspense fallback={<div>Loading...</div>}>
                <ConversationsPage />
              </Suspense>
            )
          },
          {
            path: 'assistants',
            Component: () => (
              <Suspense fallback={<div>Loading...</div>}>
                <AssistantsPage />
              </Suspense>
            )
          },
          {
            path: 'settings',
            Component: () => (
              <Suspense fallback={<div>Loading...</div>}>
                <SettingsPage />
              </Suspense>
            )
          }
        ]
      },
      {
        path: 'ai-web',
        Component: () => <Navigate to="/chat/conversations" replace />
      }
    ]
  }
])

// 导出默认路由器
export default router
