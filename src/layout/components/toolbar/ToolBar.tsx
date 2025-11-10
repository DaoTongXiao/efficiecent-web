import React from 'react'
import {
  PlusOutlined,
  SettingOutlined,
  BulbOutlined,
  MessageOutlined
} from '@ant-design/icons'
import './ToolBar.scss'

interface ToolBarProps {
  onNewChat?: () => void
  onSettings?: () => void
  onThemeToggle?: () => void
}

const ToolBar: React.FC<ToolBarProps> = ({
  onNewChat,
  onSettings,
  onThemeToggle
}) => {
  return (
    <div className="toolbar">
      <div className="toolbar-btn" onClick={() => onNewChat?.()}>
        <span className="toolbar-tooltip">助手</span>
        <MessageOutlined />
      </div>
      <div className="toolbar-btn">
        <span className="toolbar-tooltip">新建会话</span>
        <PlusOutlined />
      </div>
      <div className="toolbar-btn" onClick={() => onSettings?.()}>
        <span className="toolbar-tooltip">设置</span>
        <SettingOutlined />
      </div>
      <div className="toolbar-btn" onClick={() => onThemeToggle?.()}>
        <span className="toolbar-tooltip">切换主题</span>
        <BulbOutlined />
      </div>
    </div>
  )
}

export default ToolBar
