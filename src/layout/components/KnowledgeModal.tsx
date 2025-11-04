import { Modal, Form, Input } from 'antd'
import React, { useEffect } from 'react'

import { Knowledge } from '@/api/knowledges'

interface KnowledgeModalProps {
  visible: boolean
  editingKnowledge: Knowledge | null
  onOk: (values: { title: string; description: string; sort: number }) => void
  onCancel: () => void
}

const KnowledgeModal: React.FC<KnowledgeModalProps> = ({
  visible,
  editingKnowledge,
  onOk,
  onCancel
}) => {
  const [form] = Form.useForm()

  // 当 Modal 打开时设置表单值
  useEffect(() => {
    if (visible && editingKnowledge) {
      form.setFieldsValue({
        title: editingKnowledge.name,
        description: editingKnowledge.description,
        sort: editingKnowledge.sort
      })
    } else if (visible) {
      form.resetFields()
    }
  }, [visible, editingKnowledge, form])

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      onOk(values)
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  const getModalTitle = () => {
    return editingKnowledge ? '编辑知识库' : '创建知识库'
  }

  const getModalOkText = () => {
    return editingKnowledge ? '更新' : '创建'
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
          sort: 0
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

export default KnowledgeModal