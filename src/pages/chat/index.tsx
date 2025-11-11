import SideBar from '@/components/sidebar/SideBar'
import './index.scss'
import { useState } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
const ChatPage = () => {
  // Tab切换处理 - 使用路由导航
  // 根据路由设置activeTab
  const navigate = useNavigate()
  const location = useLocation()
  const getActiveTabFromPath = (
    path: string
  ): 'assistants' | 'conversations' | 'settings' => {
    if (path.includes('/assistants')) return 'assistants'
    if (path.includes('/settings')) return 'settings'
    return 'conversations'
  }
  const [activeTab, setActiveTab] = useState<
    'assistants' | 'conversations' | 'settings'
  >(getActiveTabFromPath(location.pathname))
  const handleTabChange = (key: string) => {
    const tabKey = key as typeof activeTab
    setActiveTab(tabKey)
    switch (tabKey) {
      case 'assistants':
        navigate('/chat/assistants')
        break
      case 'settings':
        navigate('/chat/settings')
        break
      default:
        navigate('/chat/conversations')
    }
  }
  return (
    <div className="chat-page">
      <PanelGroup direction="horizontal" className="resizable-panel-group">
        <Panel
          defaultSize={20}
          minSize={20}
          maxSize={30}
          className="sidebar-panel"
        >
          <SideBar activeTab={activeTab} onTabChange={handleTabChange} />
        </Panel>
        <PanelResizeHandle className="resize-handle" />
        <Panel defaultSize={80} className="main-panel">
          <div className="main-content">
            <Outlet />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  )
}

export default ChatPage
