import React, { useState } from 'react'
import { useAssistantStore } from '@/store'
import { Assistant } from '@/api/assistants'
import AssistantManagement from '../../AssistantManagement'

const AssistantTab: React.FC = () => {
  const { assistants, curAssistant, setCurAssistant } = useAssistantStore()
  const [expanded, setExpanded] = useState(true)

  const handleCreate = () => {
    // TODO: 打开创建助手Modal
    console.log('创建助手')
  }

  const handleEdit = (assistant: Assistant) => {
    // TODO: 打开编辑助手Modal
    console.log('编辑助手', assistant)
  }

  const handleSelect = (assistant: Assistant) => {
    if (curAssistant && curAssistant.id === assistant.id) {
      setCurAssistant(null)
    } else {
      setCurAssistant(assistant)
    }
  }

  return (
    <div className="assistant-tab">
      <AssistantManagement
        styles={{}} // TODO: 从Layout传递样式
        assistants={assistants}
        curAssistant={curAssistant}
        expanded={expanded}
        onToggleExpanded={() => setExpanded(!expanded)}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onSelect={handleSelect}
      />
    </div>
  )
}

export default AssistantTab