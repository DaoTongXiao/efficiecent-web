import React from 'react'
import { Tabs } from 'antd'
import AssistantList from './tabs/Assistant'
import ConversationTab from './tabs/Conversation'
import './SideBar.scss'
import KnowledgeList from './tabs/Knowledge'

interface SideBarProps {
  activeTab: 'assistants' | 'conversations' | 'settings'
  onTabChange: (key: string) => void
}

const SideBar: React.FC<SideBarProps> = ({ activeTab, onTabChange }) => {
  const items = [
    {
      key: 'konwledge',
      label: '知识库',
      children: <KnowledgeList />
    },
    {
      key: 'assistants',
      label: '助手',
      children: <AssistantList />
    },
    {
      key: 'conversations',
      label: '话题',
      children: <ConversationTab />
    }
  ]

  return (
    <div className="chat-sidebar">
      <Tabs
        activeKey={activeTab}
        onChange={onTabChange}
        items={items}
        tabPosition="top"
        className="sidebar-tabs"
        size="small"
      />
    </div>
  )
}

export default SideBar
