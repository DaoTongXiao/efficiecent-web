import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import Header from './components/Header'
import ToolBar from './components/toolbar/ToolBar'
import SideBar from './components/sidebar/SideBar'
import './Layout.scss'
import { useConversationStore, useUserStore } from '@/store'

const Layout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user_info } = useUserStore()
  const { initializeConversations } = useConversationStore()

  // 根据路由设置activeTab
  const getActiveTabFromPath = (path: string): 'assistants' | 'conversations' | 'settings' => {
    if (path.includes('/assistants')) return 'assistants'
    if (path.includes('/settings')) return 'settings'
    return 'conversations'
  }

  const [activeTab, setActiveTab] = useState<'assistants' | 'conversations' | 'settings'>(
    getActiveTabFromPath(location.pathname)
  )

  // 改进：监听user_id变化，确保初始化
  useEffect(() => {
    const userId = user_info.user_id
    if (userId) {
      initializeConversations(userId)
    }
  }, [user_info.user_id, initializeConversations])

  // 工具栏事件处理
  const handleNewChat = () => {
    console.log('新建对话')
    navigate('/conversations')
  }

  const handleSettings = () => {
    navigate('/settings')
  }

  const handleThemeToggle = () => {
    console.log('切换主题')
    // TODO: 实现主题切换逻辑
  }

  // Tab切换处理 - 使用路由导航
  const handleTabChange = (key: string) => {
    const tabKey = key as typeof activeTab
    setActiveTab(tabKey)
    switch (tabKey) {
      case 'assistants':
        navigate('/assistants')
        break
      case 'settings':
        navigate('/settings')
        break
      default:
        navigate('/conversations')
    }
  }

  return (
    <div className="layout">
      <Header />
      <div className="layout-body">
        <ToolBar
          onNewChat={handleNewChat}
          onSettings={handleSettings}
          onThemeToggle={handleThemeToggle}
        />
        <SideBar activeTab={activeTab} onTabChange={handleTabChange} />
        {/* 使用 Outlet 渲染子路由 */}
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout
