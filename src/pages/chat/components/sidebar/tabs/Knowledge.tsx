import useKnowledgeStore from '@/store/knowledgeStore'
import { List, Tooltip } from 'antd'
import React, { useEffect } from 'react'
import './Knowledge.scss'

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

const KnowledgeList: React.FC = () => {
  const { knowledges, curKnowledge, setCurKnowledge, fetchKnowledges } =
    useKnowledgeStore()

  useEffect(() => {
    fetchKnowledges()
  }, [])

  return (
    <div className="knowledge-list">
      <List
        size="small"
        dataSource={knowledges}
        split={false}
        renderItem={(item, index) => {
          const isSelected = curKnowledge?.id === item.id
          const color = colorPalette[index % colorPalette.length]
          return (
            <List.Item
              className={`knowledge-item ${isSelected ? 'selected' : ''}`}
              onClick={() => setCurKnowledge(item)}
            >
              <div
                className="knowledge-index"
                style={{ background: color }}
              >
                {index + 1}
              </div>
              <List.Item.Meta
                title={
                  <Tooltip title={item.name}>
                    <div className="knowledge-name">
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

export default KnowledgeList
