import SideBar from '@/components/sidebar/SideBar'
import './index.scss'
import { useState } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import ChatContainer from './sub/ConversationsPage'
const ChatPage = () => {
  const [activeTab, setActiveTab] = useState<
    'assistants' | 'conversations' | 'settings'
  >('conversations')

  const handleTabChange = (key: string) => {
    const tabKey = key as typeof activeTab
    setActiveTab(tabKey)
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
            <ChatContainer />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  )
}

export default ChatPage
