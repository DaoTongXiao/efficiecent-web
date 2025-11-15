import SideBar from '@/pages/chat/components/sidebar/SideBar'
import './index.scss'
import { useState } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import ChatContainer from './components/chat-container'
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
          maxSize={25}
          defaultSize={15}
          minSize={15}
          className="sidebar-panel"
        >
          <SideBar activeTab={activeTab} onTabChange={handleTabChange} />
        </Panel>
        <PanelResizeHandle className="resize-handle" />
        <Panel
          maxSize={85}
          defaultSize={85}
          minSize={75}
          className="main-panel"
        >
          <div className="main-content">
            <ChatContainer />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  )
}

export default ChatPage
