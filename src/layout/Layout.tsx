import React, { useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'

import Header from './components/header/Header'
import ToolBar from './components/toolbar/ToolBar'

import './Layout.scss'
import { useConversationStore, useUserStore } from '@/store'

const Layout: React.FC = () => {
  const navigate = useNavigate()
  const { user_info } = useUserStore()
  const { initializeConversations } = useConversationStore()

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
    navigate('/chat')
  }

  const handleSettings = () => {
    navigate('/settings')
  }

  const handleThemeToggle = () => {
    console.log('切换主题')
    // TODO: 实现主题切换逻辑
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
        <div className="page-container">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout
