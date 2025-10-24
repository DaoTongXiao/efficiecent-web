import {
  DeleteOutlined,
  PlusOutlined,
  DatabaseOutlined} from '@ant-design/icons'
import { Conversations } from '@ant-design/x'
import { Button, List, Tooltip } from 'antd'
import { useState } from 'react'
import React from 'react'

import { Conversation, T } from '@/types/typing'
import ai_logo from '@/assets/ai.png'
import { useConversationStore, useUserStore } from '@/store'

interface ChatSiderProps {
  styles: Record<string, string>
  locales: T
  conversations: Conversation[]
  curConversation: string
}

const ChatSider: React.FC<ChatSiderProps> = ({
  styles,
  locales,
  conversations,
  curConversation
}) => {
  const {createConversationAsync, getConversationAsync, deleteConversationAsync} = useConversationStore()
  const { user_info } = useUserStore()
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState<string>('1')
  
  /**
   * 创建会话
   */
  const onClickCreate = async () => {
    await createConversationAsync({
        title: `${locales.newConversation} ${conversations.length + 1}`,
        user_meta: {
          user_id: user_info.user_id ?? '',
          user_name: user_info.user_name ?? '',
          prompt: '',
          business_id: user_info.business_id ?? ''
        }
    })
  }
  
  /**
   * onClickDelete
   * @param key 
   */
  const onClickDelete = async (key: string) => {
    await deleteConversationAsync(key)
  }

  /**
   * handleActiveChange
   * @param val 
   */
  const handleActiveChange = async (val: string) => {
      await getConversationAsync(val)
    }
    
  return (
    <div className={styles.sider}>
      {/* 🌟 Logo */}
      <div className={styles.logo}>
        <img
          src={ai_logo}
          draggable={false}
          alt="logo"
          width={24}
          height={24}
        />
        <span>智慧引擎</span>
      </div>

      {/* 🌟 添加会话 */}
      <Button
        onClick={onClickCreate}
        type="link"
        className={styles.addBtn}
        icon={<PlusOutlined />}
      >
        {locales.newConversation}
      </Button>

      {/* 🌟 知识库管理 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h4>知识库管理</h4>
          <Button
            type="text"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => {
              // TODO: 实现创建知识库逻辑
              console.log('创建知识库')
            }}
            title="创建知识库"
          />
        </div>
        <List
          size="small"
          dataSource={[
            { key: '1', name: '通用知识库', description: '包含基础知识和常见问题' },
            { key: '2', name: '技术文档库', description: '编程和技术相关文档' },
            { key: '3', name: '业务知识库', description: '业务相关知识和资料' }
          ]}
          renderItem={(item) => {
            const isSelected = selectedKnowledgeBase === item.key
             return (<List.Item
              className={`${styles.knowledgeItem} ${isSelected ? 'selected' : ''}`}
              onClick={() => {
                setSelectedKnowledgeBase(item.key)
                console.log('选择知识库:', item.name)
              }}
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
            </List.Item>)}
          }
        />
      </div>

      {/* 🌟 会话管理 */}
      <Conversations
        items={conversations}
        className={styles.conversations}
        activeKey={curConversation}
        onActiveChange={handleActiveChange}
        groupable
        styles={{ item: { padding: '0 8px' } }}
        menu={(conversation) => ({
          items: [
            {
              label: locales.delete,
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

export default ChatSider