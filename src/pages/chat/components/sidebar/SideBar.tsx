import React from 'react'
import { Tabs } from 'antd'
import { createStyles } from 'antd-style'
import AssistantList from './tabs/Assistant'
import ConversationTab from './tabs/Conversation'
import KnowledgeList from './tabs/Knowledge'

const useSideBarStyles = createStyles(({ css, token }) => ({
  chatSidebar: css`
    height: 100%;
    background: #ffffff;
    border-left: 1px solid ${token.colorBorderSecondary};
    border-right: 1px solid ${token.colorBorderSecondary};
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: left;
    padding-left: 5px;
    flex: 1;
  `,
  sidebarTabs: css`
    height: 100%;
    width: 100%;

    .ant-tabs-nav {
      padding: 5px 15px;
      width: 100%;
      margin: 0;
    }

    .ant-tabs-content {
      height: calc(100% - 46px);
      overflow: hidden;
    }

    .ant-tabs-tabpane {
      height: 100%;
      overflow-y: auto;
      padding: 8px;
    }

    :global(.ant-tabs-content-holder) {
      flex: 1;
      overflow: auto;
    }
  `
}))

interface SideBarProps {
  activeTab: 'assistants' | 'conversations' | 'settings'
  onTabChange: (key: string) => void
}

const SideBar: React.FC<SideBarProps> = ({ activeTab, onTabChange }) => {
  const { styles } = useSideBarStyles()

  const items = [
    {
      key: 'konwledge',
      label: '知识库',
      children: <KnowledgeList />
    },
    {
      key: 'assistants',
      label: '助手',
      children: <AssistantList />
    },
    {
      key: 'conversations',
      label: '话题',
      children: <ConversationTab />
    }
  ]

  return (
    <div className={styles.chatSidebar}>
      <Tabs
        activeKey={activeTab}
        onChange={onTabChange}
        items={items}
        tabPosition="top"
        className={styles.sidebarTabs}
        size="small"
      />
    </div>
  )
}

export default SideBar
