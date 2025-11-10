import React from 'react'
import { Form, Switch, Select, Slider, Divider } from 'antd'

const { Option } = Select

const SettingsTab: React.FC = () => {
  const [form] = Form.useForm()

  return (
    <div className="settings-tab">
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          theme: 'light',
          language: 'zh-CN',
          fontSize: 14,
          autoSave: true
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
          <Slider min={12} max={20} />
        </Form.Item>

        <Divider orientation="left">语言设置</Divider>
        <Form.Item label="语言" name="language">
          <Select>
            <Option value="zh-CN">中文</Option>
            <Option value="en-US">English</Option>
          </Select>
        </Form.Item>

        <Divider orientation="left">其他设置</Divider>
        <Form.Item label="自动保存" name="autoSave" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item label="显示消息时间" name="showTime" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </div>
  )
}

export default SettingsTab