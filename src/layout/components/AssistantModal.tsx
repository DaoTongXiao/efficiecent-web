import { Modal, Form, Input } from 'antd'
import React, { useEffect } from 'react'

import { Assistant } from '@/api/assistants'

interface AssistantModalProps {
  visible: boolean
  editingAssistant: Assistant | null
  onOk: (values: {
    title: string
    description: string
    prompt: string
    sort: number
  }) => void
  onCancel: () => void
}

const AssistantModal: React.FC<AssistantModalProps> = ({
  visible,
  editingAssistant,
  onOk,
  onCancel
}) => {
  const [form] = Form.useForm()

  // 当 Modal 打开时设置表单值
  useEffect(() => {
    if (visible && editingAssistant) {
      form.setFieldsValue({
        title: editingAssistant.name,
        description: editingAssistant.description,
        prompt: editingAssistant.prompt,
        sort: editingAssistant.sort
      })
    } else if (visible) {
      form.resetFields()
    }
  }, [visible, editingAssistant, form])

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      onOk(values)
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  const getModalTitle = () => {
    return editingAssistant ? '编辑助手' : '创建助手'
  }

  const getModalOkText = () => {
    return editingAssistant ? '更新' : '创建'
  }

  return (
    <Modal
      title={getModalTitle()}
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText={getModalOkText()}
      cancelText="取消"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          title: '',
          description: '',
          prompt: '',
          sort: 0
        }}
      >
        <Form.Item
          name="title"
          label="助手名称"
          rules={[{ required: true, message: '请输入助手名称' }]}
        >
          <Input placeholder="请输入助手名称" />
        </Form.Item>
        <Form.Item
          name="description"
          label="助手描述"
          rules={[{ required: true, message: '请输入助手描述' }]}
        >
          <Input.TextArea placeholder="请输入助手描述" rows={3} />
        </Form.Item>
        <Form.Item
          name="prompt"
          label="提示词"
          rules={[{ required: true, message: '请输入提示词' }]}
        >
          <Input.TextArea placeholder="请输入助手的提示词" rows={4} />
        </Form.Item>
        <Form.Item
          name="sort"
          label="排序"
          rules={[{ required: true, message: '请输入排序值' }]}
        >
          <Input type="number" placeholder="请输入排序值" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AssistantModal
