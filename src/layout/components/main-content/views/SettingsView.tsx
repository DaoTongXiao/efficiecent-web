import React from 'react'
import { Card, Form, Switch, Select, Slider, Divider, Button } from 'antd'
import { SaveOutlined } from '@ant-design/icons'

const { Option } = Select

const SettingsView: React.FC = () => {
  const [form] = Form.useForm()

  const handleSave = () => {
    form.validateFields().then((values) => {
      console.log('保存设置:', values)
      // TODO: 保存设置到store或本地存储
    })
  }

  return (
    <div className="settings-view">
      <Card
        title="系统设置"
        extra={
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
            保存设置
          </Button>
        }
        style={{ height: '100%', overflow: 'auto' }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            theme: 'light',
            language: 'zh-CN',
            fontSize: 14,
            autoSave: true,
            showTime: true,
            maxTokens: 4096,
            temperature: 0.7
          }}
        >
          <Divider orientation="left">外观设置</Divider>
          <Form.Item label="主题" name="theme">
            <Select>
              <Option value="light">浅色</Option>
              <Option value="dark">深色</Option>
              <Option value="auto">跟随系统</Option>
            </Select>
          </Form.Item>

          <Form.Item label="字体大小" name="fontSize">
            <Slider min={12} max={20} marks={{ 12: '12px', 14: '14px', 16: '16px', 18: '18px', 20: '20px' }} />
          </Form.Item>

          <Divider orientation="left">语言设置</Divider>
          <Form.Item label="语言" name="language">
            <Select>
              <Option value="zh-CN">中文</Option>
              <Option value="en-US">English</Option>
            </Select>
          </Form.Item>

          <Divider orientation="left">对话设置</Divider>
          <Form.Item label="自动保存会话" name="autoSave" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label="显示消息时间" name="showTime" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label="最大Token数" name="maxTokens">
            <Slider min={512} max={32768} step={512} marks={{ 512: '512', 4096: '4K', 8192: '8K', 16384: '16K', 32768: '32K' }} />
          </Form.Item>

          <Form.Item label="温度（Creativity）" name="temperature">
            <Slider min={0} max={2} step={0.1} marks={{ 0: '保守', 0.7: '平衡', 1.5: '创意', 2: '随机' }} />
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default SettingsView