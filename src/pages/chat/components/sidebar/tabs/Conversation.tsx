import React from 'react'
import { Conversations } from '@ant-design/x'
import { useConversationStore } from '@/store'
import { zhCN } from '@/locales/locales'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import './Conversation.scss'

const ConversationTab: React.FC = () => {
  const {
    conversations,
    curConversation,
    setCurConversation,
    deleteConversationAsync,
    getConversationAsync,
    createConversationAsync
  } = useConversationStore()

  const handleActiveChange = async (val: string) => {
    await getConversationAsync(val)
    setCurConversation(val)
  }

  const onClickDelete = async (key: string) => {
    await deleteConversationAsync(key)
  }

  const onClickCreate = async () => {
    const meta = {
      title: zhCN.newConversation ?? '新建会话',
      // 顶部按钮仅负责触发新会话，可传入占位 user_meta，避免前端类型错误
      user_meta: {
        user_id: '',
        user_name: '',
        prompt: '',
        business_id: ''
      }
    }
    await createConversationAsync(meta)
  }

  return (
    <div className="conversation-tab">
      <div
        className="create-conversation"
        onClick={onClickCreate}
      >
        <PlusOutlined style={{ fontSize: 12 }} />
        新建对话
      </div>
      <Conversations
        className="conversations"
        activeKey={curConversation}
        onActiveChange={handleActiveChange}
        groupable
        items={conversations}
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
