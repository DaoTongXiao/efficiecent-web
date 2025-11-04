import { Modal, List, Avatar, Button } from 'antd'
import React from 'react'

import { Knowledge } from '@/api/knowledges'

interface SelectKnowledgeModalProps {
  visible: boolean
  knowledges: Knowledge[]
  onSelect: (knowledge: Knowledge) => void
  onCancel: () => void
}

const SelectKnowledgeModal: React.FC<SelectKnowledgeModalProps> = ({
  visible,
  knowledges,
  onSelect,
  onCancel
}) => {
  return (
    <Modal
      title="选择知识库"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <List
        dataSource={knowledges}
        renderItem={(knowledge) => (
          <List.Item
            actions={[
              <Button
                type="primary"
                onClick={() => onSelect(knowledge)}
              >
                选择
              </Button>
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar>{knowledge.name.charAt(0)}</Avatar>}
              title={knowledge.name}
              description={knowledge.description}
            />
          </List.Item>
        )}
      />
    </Modal>
  )
}

export default SelectKnowledgeModal