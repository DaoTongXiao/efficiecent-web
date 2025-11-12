import { List, Tooltip } from 'antd'
import React, { useEffect } from 'react'
import useKnowledgeStore from '@/store/knowledgeStore'

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
              className={`knowledgeItem ${isSelected ? 'selected' : ''}`}
              onClick={() => setCurKnowledge(item)}
            >
              <div
                className="knowledge-index"
                style={{
                  minWidth: 20,
                  height: 20,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 600,
                  marginRight: 8,
                  color: '#fff',
                  background: color,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.15)'
                }}
              >
                {index + 1}
              </div>
              <List.Item.Meta
                title={
                  <Tooltip title={item.name}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: isSelected ? 600 : 500,
                        color: isSelected ? '#1677ff' : '#1f2933',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
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
