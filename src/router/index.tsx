import { lazy } from 'react'
import { createHashRouter } from 'react-router-dom'
import Layout from '@/layout/Layout'
import { Suspense } from 'react'

// 懒加载页面组件
const AssistantsPage = lazy(() => import('@/pages/chat/AssistantsPage'))
const ConversationsPage = lazy(() => import('@/pages/chat/ConversationsPage'))
const SettingsPage = lazy(() => import('@/pages/chat/SettingsPage'))

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
        Component: () => (
          <Suspense fallback={<div>Loading...</div>}>
            <ConversationsPage />
          </Suspense>
        )
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
      },
      {
        path: 'ai-web',
        Component: () => (
          <Suspense fallback={<div>Loading...</div>}>
            <ConversationsPage />
          </Suspense>
        )
      }
    ]
  }
])

// 导出默认路由器
export default router
