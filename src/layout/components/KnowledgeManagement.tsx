import { PlusOutlined, EditOutlined, DatabaseOutlined, DownOutlined, RightOutlined } from '@ant-design/icons'
import { Button, List, Tooltip } from 'antd'
import React from 'react'

import { Knowledge } from '@/api/knowledges'

interface KnowledgeManagementProps {
  styles: Record<string, string>
  knowledges: Knowledge[]
  curKnowledge: Knowledge | null
  expanded: boolean
  onToggleExpanded: () => void
  onCreate: () => void
  onEdit: (knowledge: Knowledge) => void
  onSelect: (knowledge: Knowledge) => void
}

const KnowledgeManagement: React.FC<KnowledgeManagementProps> = ({
  styles,
  knowledges,
  curKnowledge,
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
            <h4 style={{ margin: 0 }}>知识库管理</h4>
          </div>
          <Button
            type="text"
            size="small"
            icon={<PlusOutlined />}
            onClick={onCreate}
            title="创建知识库"
          />
        </div>
      </div>
      {expanded && (
        <List
          size="small"
          dataSource={knowledges}
          renderItem={(item) => {
            const isSelected = curKnowledge?.id === item.id
            return (
              <List.Item
                className={`${styles.knowledgeItem} ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelect(item)}
                actions={curKnowledge ? [
                  <Button
                    key="edit"
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit(curKnowledge)
                    }}
                    title="编辑知识库"
                  />
                ] : []}
              >
                <List.Item.Meta
                  avatar={<DatabaseOutlined />}
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

export default KnowledgeManagement