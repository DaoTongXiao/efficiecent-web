import {
  DeleteOutlined,
  PlusOutlined,
  DatabaseOutlined,
  EditOutlined} from '@ant-design/icons'
import { Conversations } from '@ant-design/x'
import { Button, List, Tooltip, Modal, Form, Input, message } from 'antd'
import { useState, useEffect } from 'react'
import React from 'react'

import { Conversation, T } from '@/types/typing'
import ai_logo from '@/assets/ai.png'
import { useConversationStore, useUserStore, useKnowledgeStore } from '@/store'
import { Knowledge } from '@/api/knowledges'

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
  const { knowledges, fetchKnowledges, createKnowledgeAsync, updateKnowledgeAsync,setCurKnowledge } = useKnowledgeStore()
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState<string>('1')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingKnowledge, setEditingKnowledge] = useState<Knowledge | null>(null)
  const [form] = Form.useForm()

  // 初始化时获取知识库列表
  useEffect(() => {
    fetchKnowledges()
  }, [])

  // 处理创建知识库
  const handleCreateKnowledge = () => {
    setEditingKnowledge(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  // 处理编辑知识库
  const handleEditKnowledge = (knowledge: Knowledge) => {
    setEditingKnowledge(knowledge)
    form.setFieldsValue({
      title: knowledge.name,
      description: knowledge.description
    })
    setIsModalVisible(true)
  }

  // 处理Modal确认
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      const knowledgeData = {
        name: values.title,
        description: values.description,
        created_by: String(user_info.user_id || ''),
        updated_by: String(user_info.user_id || '')
      }

      if (editingKnowledge) {
        // 更新知识库
        await updateKnowledgeAsync(editingKnowledge.id, knowledgeData)
        message.success('知识库更新成功')
      } else {
        // 创建知识库
        await createKnowledgeAsync(knowledgeData)
        message.success('知识库创建成功')
      }

      setIsModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.error('操作失败:', error)
    }
  }

  // 处理Modal取消
  const handleModalCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
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
              // 创建知识库逻辑
              handleCreateKnowledge()
            }}
            title="创建知识库"
          />
        </div>
        <List
          size="small"
          dataSource={knowledges}
          renderItem={(item) => {
            const isSelected = selectedKnowledgeBase === item.id
            const knowledge = knowledges?.find(k => k.id === item.id)
             return (<List.Item
              className={`${styles.knowledgeItem} ${isSelected ? 'selected' : ''}`}
              onClick={() => {
                setSelectedKnowledgeBase(item.id)
                setCurKnowledge(item)
                console.log('选择知识库:', item.name)
              }}
              actions={knowledge ? [
                <Button
                  key="edit"
                  type="text"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEditKnowledge(knowledge)
                  }}
                  title="编辑知识库"
                />
              ] : []}
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

      {/* 🌟 知识库编辑Modal */}
      <Modal
        title={editingKnowledge ? '编辑知识库' : '创建知识库'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={editingKnowledge ? '更新' : '创建'}
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            title: '',
            description: ''
          }}
        >
          <Form.Item
            name="title"
            label="知识库名称"
            rules={[{ required: true, message: '请输入知识库名称' }]}
          >
            <Input placeholder="请输入知识库名称" />
          </Form.Item>
          <Form.Item
            name="description"
            label="知识库描述"
            rules={[{ required: true, message: '请输入知识库描述' }]}
          >
            <Input.TextArea
              placeholder="请输入知识库描述"
              rows={3}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ChatSider