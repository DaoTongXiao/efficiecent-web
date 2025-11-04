import { Modal, Form, Input } from 'antd'
import React, { useEffect } from 'react'

interface KnowledgeFragmentModalProps {
  visible: boolean
  onOk: (content: string) => void
  onCancel: () => void
}

const KnowledgeFragmentModal: React.FC<KnowledgeFragmentModalProps> = ({
  visible,
  onOk,
  onCancel
}) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (visible) {
      form.resetFields()
    }
  }, [visible, form])

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      onOk(values.content)
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  return (
    <Modal
      title="添加知识片段"
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText="插入"
      cancelText="取消"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          content: ''
        }}
      >
        <Form.Item
          name="content"
          label="知识片段内容"
          rules={[{ required: true, message: '请输入知识片段内容' }]}
        >
          <Input.TextArea
            placeholder="请输入知识片段内容"
            rows={6}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default KnowledgeFragmentModal