import React from 'react'
import { Conversations } from '@ant-design/x'
import { useConversationStore } from '@/store'
import { zhCN } from '@/locales/locales'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'

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
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 8px',
          margin: '0 8px 8px 8px',
          borderRadius: 6,
          fontSize: 13,
          fontWeight: 500,
          color: '#1677ff',
          backgroundColor: '#f0f5ff',
          cursor: 'pointer',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
        }}
      >
        <PlusOutlined style={{ fontSize: 12 }} />
        新建对话
      </div>
      <Conversations
        className="conversations"
        activeKey={curConversation}
        onActiveChange={handleActiveChange}
        groupable
        styles={{ item: { padding: '0 8px' } }}
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
