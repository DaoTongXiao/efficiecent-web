import React from 'react'
import { Conversations } from '@ant-design/x'
import { useConversationStore } from '@/store'
import { zhCN } from '@/locales/locales'
import { DeleteOutlined } from '@ant-design/icons'

const ConversationTab: React.FC = () => {
  const {
    conversations,
    curConversation,
    setCurConversation,
    deleteConversationAsync,
    getConversationAsync
  } = useConversationStore()
  const handleActiveChange = async (val: string) => {
    await getConversationAsync(val)
    setCurConversation(val)
  }

  const onClickDelete = async (key: string) => {
    await deleteConversationAsync(key)
  }

  return (
    <div className="conversation-tab">
      <Conversations
        items={conversations}
        className="conversations"
        activeKey={curConversation}
        onActiveChange={handleActiveChange}
        groupable
        styles={{ item: { padding: '0 8px' } }}
        menu={(conversation) => ({
          items: [
            {
              label: zhCN.delete,
              key: 'delete',
              icon: <DeleteOutlined />,
              danger: true,
              onClick: async () => {
                await onClickDelete(conversation.key)
              }
            }
          ]
        })}
      />
    </div>
  )
}

export default ConversationTab
