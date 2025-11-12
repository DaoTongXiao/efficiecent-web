import React from 'react'
import { Card, Avatar, Typography, Button, Empty } from 'antd'
import { RobotOutlined, SettingOutlined } from '@ant-design/icons'
import { useAssistantStore } from '@/store'

const { Title, Paragraph } = Typography
const { Meta } = Card

const AssistantView: React.FC = () => {
  const { curAssistant } = useAssistantStore()

  if (!curAssistant) {
    return (
      <div className="assistant-view">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="请选择一个助手进行查看"
        />
      </div>
    )
  }

  return (
    <div className="assistant-view">
      <Card
        style={{ height: '100%' }}
        actions={[
          <Button key="edit" icon={<SettingOutlined />}>
            编辑助手
          </Button>
        ]}
      >
        <Meta
          avatar={<Avatar size={64} icon={<RobotOutlined />} />}
          title={<Title level={3}>{curAssistant.name}</Title>}
          description={curAssistant.description}
        />
        <div style={{ marginTop: 24 }}>
          <Title level={5}>提示词</Title>
          <Paragraph
            ellipsis={{ rows: 6, expandable: true, symbol: '展开' }}
            style={{ whiteSpace: 'pre-wrap' }}
          >
            {curAssistant.prompt_text || curAssistant.prompt}
          </Paragraph>
        </div>
        <div style={{ marginTop: 16 }}>
          <Title level={5}>创建时间</Title>
          <Paragraph>
            {new Date(curAssistant.created_at).toLocaleString()}
          </Paragraph>
        </div>
        <div style={{ marginTop: 16 }}>
          <Title level={5}>更新时间</Title>
          <Paragraph>
            {new Date(curAssistant.updated_at).toLocaleString()}
          </Paragraph>
        </div>
      </Card>
    </div>
  )
}

export default AssistantView
