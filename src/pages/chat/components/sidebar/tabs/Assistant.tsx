import useAssistantStore from '@/store/assistantStore'
import { List, Tooltip } from 'antd'
import React, { useEffect } from 'react'
import './Assistant.scss'

const colorPalette = [
  '#1677ff',
  '#52c41a',
  '#faad14',
  '#eb2f96',
  '#13c2c2',
  '#722ed1',
  '#fa541c',
  '#2f54eb',
  '#a0d911',
  '#eb4d4b'
]

const AssistantList: React.FC = () => {
  const { assistants, curAssistant, setCurAssistant, fetchAssistants } =
    useAssistantStore()

  useEffect(() => {
    fetchAssistants()
  }, [])

  return (
    <div className="assistant-list">
      <List
        size="small"
        dataSource={assistants}
        split={false}
        renderItem={(item, index) => {
          const isSelected = curAssistant?.id === item.id
          const color = colorPalette[index % colorPalette.length]
          return (
            <List.Item
              className={`assistant-item ${isSelected ? 'selected' : ''}`}
              onClick={() => setCurAssistant(item)}
            >
              <div
                className="assistant-index"
                style={{ background: color }}
              >
                {index + 1}
              </div>
              <List.Item.Meta
                title={
                  <Tooltip title={item.name}>
                    <div className="assistant-name">
                      {item.name}
                    </div>
                  </Tooltip>
                }
              />
            </List.Item>
          )
        }}
      />
    </div>
  )
}

export default AssistantList
