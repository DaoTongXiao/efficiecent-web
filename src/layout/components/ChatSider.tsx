import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Conversations } from '@ant-design/x'
import { Button, message } from 'antd'
import { useState, useEffect } from 'react'
import React from 'react'

import { Conversation, T } from '@/types/typing'
import ai_logo from '@/assets/ai.png'
import { useConversationStore, useUserStore, useKnowledgeStore, useAssistantStore } from '@/store'
import { Knowledge } from '@/api/knowledges'
import { Assistant } from '@/api/assistants'
import KnowledgeManagement from './KnowledgeManagement'
import AssistantManagement from './AssistantManagement'
import KnowledgeModal from './KnowledgeModal'
import AssistantModal from './AssistantModal'
import SelectKnowledgeModal from './SelectKnowledgeModal'
import KnowledgeFragmentModal from './KnowledgeFragmentModal'
import { instertKnowledge } from '@/api/conversion/message'

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
  const {createConversationAsync,setCurConversation, getConversationAsync, deleteConversationAsync} = useConversationStore()
  const { user_info } = useUserStore()
  const { knowledges,curKnowledge, fetchKnowledges, createKnowledgeAsync, updateKnowledgeAsync,setCurKnowledge } = useKnowledgeStore()
  const { assistants,curAssistant, fetchAssistants, createAssistantAsync, updateAssistantAsync,setCurAssistant } = useAssistantStore()
  const [knowledgeModalVisible, setKnowledgeModalVisible] = useState(false)
  const [assistantModalVisible, setAssistantModalVisible] = useState(false)
  const [selectKnowledgeModalVisible, setSelectKnowledgeModalVisible] = useState(false)
  const [fragmentModalVisible, setFragmentModalVisible] = useState(false)
  const [editingKnowledge, setEditingKnowledge] = useState<Knowledge | null>(null)
  const [editingAssistant, setEditingAssistant] = useState<Assistant | null>(null)
  const [selectedKnowledgeForFragment, setSelectedKnowledgeForFragment] = useState<Knowledge | null>(null)
  const [knowledgeExpanded, setKnowledgeExpanded] = useState(true)
  const [assistantExpanded, setAssistantExpanded] = useState(true)

  // 初始化时获取知识库列表和助手列表
  useEffect(() => {
    fetchKnowledges()
    fetchAssistants()
  }, [])

  // 处理创建知识库
  const handleCreateKnowledge = () => {
    setEditingKnowledge(null)
    setKnowledgeModalVisible(true)
  }

  // 处理编辑知识库
  const handleEditKnowledge = (knowledge: Knowledge) => {
    setEditingKnowledge(knowledge)
    setKnowledgeModalVisible(true)
  }

  // 处理创建助手
  const handleCreateAssistant = () => {
    setEditingAssistant(null)
    setAssistantModalVisible(true)
  }

  // 处理编辑助手
  const handleEditAssistant = (assistant: Assistant) => {
    setEditingAssistant(assistant)
    setAssistantModalVisible(true)
  }

  // 处理知识库Modal确认
  const handleKnowledgeModalOk = async (values: { title: string; description: string; sort: number }) => {
    try {
      if (editingKnowledge) {
        // 更新知识库
        const knowledgeData = {
          name: values.title,
          sort: values.sort,
          description: values.description,
          created_by: String(user_info.user_id || ''),
          updated_by: String(user_info.user_id || '')
        }
        await updateKnowledgeAsync(editingKnowledge.id, knowledgeData)
        message.success('知识库更新成功')
      } else {
        // 创建知识库
        const knowledgeData = {
          name: values.title,
          sort: values.sort,
          description: values.description,
          created_by: String(user_info.user_id || ''),
          updated_by: String(user_info.user_id || '')
        }
        await createKnowledgeAsync(knowledgeData)
        message.success('知识库创建成功')
      }

      setKnowledgeModalVisible(false)
      setEditingKnowledge(null)
    } catch (error) {
      console.error('操作失败:', error)
    }
  }

  // 处理助手Modal确认
  const handleAssistantModalOk = async (values: { title: string; description: string; prompt: string; sort: number }) => {
    try {
      if (editingAssistant) {
        // 更新助手
        const assistantData = {
          name: values.title,
          sort: values.sort,
          description: values.description,
          prompt_text: values.prompt,
          created_by: String(user_info.user_id || ''),
          updated_by: String(user_info.user_id || '')
        }
        await updateAssistantAsync(editingAssistant.id, assistantData)
        message.success('助手更新成功')
      } else {
        // 创建助手
        const assistantData = {
          name: values.title,
          sort: values.sort,
          description: values.description,
          prompt_text: values.prompt,
          created_by: String(user_info.user_id || ''),
          updated_by: String(user_info.user_id || '')
        }
        await createAssistantAsync(assistantData)
        message.success('助手创建成功')
      }

      setAssistantModalVisible(false)
      setEditingAssistant(null)
    } catch (error) {
      console.error('操作失败:', error)
    }
  }

  // 处理知识库Modal取消
  const handleKnowledgeModalCancel = () => {
    setKnowledgeModalVisible(false)
    setEditingKnowledge(null)
  }

  // 处理助手Modal取消
  const handleAssistantModalCancel = () => {
    setAssistantModalVisible(false)
    setEditingAssistant(null)
  }

  // 处理选择知识库Modal取消
  const handleSelectKnowledgeModalCancel = () => {
    setSelectKnowledgeModalVisible(false)
  }

  // 处理选择知识库
  const handleSelectKnowledge = (knowledge: Knowledge) => {
    setCurKnowledge(knowledge)
    setSelectKnowledgeModalVisible(false)
  }

  // 处理添加知识片段
  const handleAddFragment = (knowledge: Knowledge) => {
    setSelectedKnowledgeForFragment(knowledge)
    setFragmentModalVisible(true)
  }

  // 处理知识片段Modal确认
  const handleFragmentModalOk = async (content: string) => {
    if (!selectedKnowledgeForFragment) return
    try {
      await instertKnowledge({
        collection_name: `k_${selectedKnowledgeForFragment.id?.replace(/-/g, '_')}`,
        message_id: '',
        content
      })
      message.success('知识片段插入成功')
      setFragmentModalVisible(false)
      setSelectedKnowledgeForFragment(null)
    } catch (error) {
      console.error('插入知识片段失败:', error)
      message.error('插入知识片段失败')
    }
  }

  // 处理知识片段Modal取消
  const handleFragmentModalCancel = () => {
    setFragmentModalVisible(false)
    setSelectedKnowledgeForFragment(null)
  }
  
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
       // 切换当前对话
       setCurConversation(val)
     }
    
  return (
    <div className={styles.sider}>
      {/* 🌟 Logo */}
      <div className={styles.logo}>
        <img
          src={ai_logo}
          draggable={false}
          alt="logo"
          width={45}
          height={45}
          style={{ borderRadius: '50%' }}
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
      <KnowledgeManagement
        styles={styles}
        knowledges={knowledges}
        curKnowledge={curKnowledge}
        expanded={knowledgeExpanded}
        onToggleExpanded={() => setKnowledgeExpanded(!knowledgeExpanded)}
        onCreate={handleCreateKnowledge}
        onEdit={handleEditKnowledge}
        onSelect={(knowledge) => {
          setCurKnowledge(knowledge)
          console.log('选择知识库:', knowledge.name)
        }}
        onAddFragment={handleAddFragment}
      />

      {/* 🌟 助手管理 */}
      <AssistantManagement
        styles={styles}
        assistants={assistants}
        curAssistant={curAssistant}
        expanded={assistantExpanded}
        onToggleExpanded={() => setAssistantExpanded(!assistantExpanded)}
        onCreate={handleCreateAssistant}
        onEdit={handleEditAssistant}
        onSelect={(assistant) => {
          setCurAssistant(assistant)
          console.log('选择助手:', assistant.name)
        }}
      />

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

      {/* 🌟 知识库Modal */}
      <KnowledgeModal
        visible={knowledgeModalVisible}
        editingKnowledge={editingKnowledge}
        onOk={handleKnowledgeModalOk}
        onCancel={handleKnowledgeModalCancel}
      />

      {/* 🌟 助手Modal */}
      <AssistantModal
        visible={assistantModalVisible}
        editingAssistant={editingAssistant}
        onOk={handleAssistantModalOk}
        onCancel={handleAssistantModalCancel}
      />

      {/* 🌟 选择知识库Modal */}
      <SelectKnowledgeModal
        visible={selectKnowledgeModalVisible}
        knowledges={knowledges}
        onSelect={handleSelectKnowledge}
        onCancel={handleSelectKnowledgeModalCancel}
      />

      {/* 🌟 知识片段Modal */}
      <KnowledgeFragmentModal
        visible={fragmentModalVisible}
        onOk={handleFragmentModalOk}
        onCancel={handleFragmentModalCancel}
      />
    </div>
  )
}

export default ChatSider
