import React from 'react'
import ChatContainer from './views/ChatContainer'
import AssistantView from './views/AssistantView'
import SettingsView from './views/SettingsView'
import './MainContent.scss'

interface MainContentProps {
  activeTab: 'assistants' | 'conversations' | 'settings'
}

const MainContent: React.FC<MainContentProps> = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'assistants':
        return <AssistantView />
      case 'conversations':
        return <ChatContainer />
      case 'settings':
        return <SettingsView />
      default:
        return <ChatContainer />
    }
  }

  return (
    <div className="main-content">
      {renderContent()}
    </div>
  )
}

export default MainContent