import { PlusOutlined, EditOutlined, RobotOutlined, DownOutlined, RightOutlined } from '@ant-design/icons'
import { Button, List, Tooltip } from 'antd'
import React from 'react'

import { Assistant } from '@/api/assistants'

interface AssistantManagementProps {
  styles: Record<string, string>
  assistants: Assistant[]
  curAssistant: Assistant | null
  expanded: boolean
  onToggleExpanded: () => void
  onCreate: () => void
  onEdit: (assistant: Assistant) => void
  onSelect: (assistant: Assistant) => void
}

const AssistantManagement: React.FC<AssistantManagementProps> = ({
  styles,
  assistants,
  curAssistant,
  expanded,
  onToggleExpanded,
  onCreate,
  onEdit,
  onSelect
}) => {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              size="small"
              icon={expanded ? <DownOutlined /> : <RightOutlined />}
              onClick={onToggleExpanded}
              style={{ marginRight: 8 }}
            />
            <h4 style={{ margin: 0 }}>助手管理</h4>
          </div>
          <Button
            type="text"
            size="small"
            icon={<PlusOutlined />}
            onClick={onCreate}
            title="创建助手"
          />
        </div>
      </div>
      {expanded && (
        <List
          size="small"
          dataSource={assistants}
          style={assistants.length > 3 ? { maxHeight: '200px', overflowY: 'auto' } : {}}
          renderItem={(item) => {
            const isSelected = curAssistant?.id === item.id
            return (
              <List.Item
                className={`${styles.assistantItem} ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelect(item)}
                actions={curAssistant ? [
                  <Button
                    key="edit"
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit(curAssistant)
                    }}
                    title="编辑助手"
                  />
                ] : []}
              >
                <List.Item.Meta
                  avatar={<RobotOutlined />}
                  title={
                    <Tooltip title={item.name}>
                      <div>{item.name}</div>
                    </Tooltip>
                  }
                  description={
                    <Tooltip title={item.description}>
                      <div>{item.description}</div>
                    </Tooltip>
                  }
                />
              </List.Item>
            )
          }}
        />
      )}
    </div>
  )
}

export default AssistantManagement