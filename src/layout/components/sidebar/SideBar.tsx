import React from 'react'
import { Tabs } from 'antd'
import AssistantTab from './tabs/AssistantTab'
import ConversationTab from './tabs/ConversationTab'
import SettingsTab from './tabs/SettingsTab'
import './SideBar.scss'

interface SideBarProps {
  activeTab: 'assistants' | 'conversations' | 'settings'
  onTabChange: (key: string) => void
}

const SideBar: React.FC<SideBarProps> = ({ activeTab, onTabChange }) => {
  const items = [
    {
      key: 'assistants',
      label: '助手',
      children: <AssistantTab />
    },
    {
      key: 'conversations',
      label: '话题',
      children: <ConversationTab />
    },
    {
      key: 'settings',
      label: '设置',
      children: <SettingsTab />
    }
  ]

  return (
    <div className="sidebar">
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