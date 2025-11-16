import useKnowledgeStore from '@/store/knowledgeStore'
import { List, Tooltip } from 'antd'
import React, { useEffect } from 'react'
import useKnowledgeStyles from './Knowledge/style'

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

  const { styles } = useKnowledgeStyles()

  useEffect(() => {
    fetchKnowledges()
  }, [])

  return (
    <div className={styles.knowledgeList}>
      <List
        size="small"
        dataSource={knowledges}
        split={false}
        renderItem={(item, index) => {
          const isSelected = curKnowledge?.id === item.id
          const color = colorPalette[index % colorPalette.length]
          return (
            <List.Item
              className={`${styles.knowledgeItem} ${isSelected ? 'selected' : ''}`}
              onClick={() => setCurKnowledge(item)}
            >
              <div
                className={styles.knowledgeIndex}
                style={{ background: color }}
              >
                {index + 1}
              </div>
              <List.Item.Meta
                title={
                  <Tooltip title={item.name}>
                    <div className={styles.knowledgeName}>
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
