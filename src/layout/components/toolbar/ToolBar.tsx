import React from 'react'
import { Tooltip } from 'antd'
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
      <Tooltip title="助手" placement="right">
        <div className="toolbar-btn" onClick={() => onNewChat?.()}>
          <MessageOutlined />
        </div>
      </Tooltip>
      <Tooltip title="新建会话" placement="right">
        <div className="toolbar-btn">
          <PlusOutlined />
        </div>
      </Tooltip>
      <Tooltip title="设置" placement="right">
        <div className="toolbar-btn" onClick={() => onSettings?.()}>
          <SettingOutlined />
        </div>
      </Tooltip>
      <Tooltip title="切换主题" placement="right">
        <div className="toolbar-btn" onClick={() => onThemeToggle?.()}>
          <BulbOutlined />
        </div>
      </Tooltip>
    </div>
  )
}

export default ToolBar
