import { createStyles } from 'antd-style'

export const useStyle = createStyles(({ token, css }) => {
  return {
    layout: css`
      width: 100%;
      min-width: 1000px;
      height: 100vh;
      display: flex;
      background: ${token.colorBgContainer};
      font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;
    `,
    // sider 样式
    sider: css`
      background: ${token.colorBgLayout}80;
      width: 280px;
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 0 12px;
      box-sizing: border-box;
    `,
    logo: css`
      display: flex;
      align-items: center;
      justify-content: start;
      padding: 0 24px;
      box-sizing: border-box;
      gap: 8px;
      margin: 24px 0;

      span {
        font-weight: bold;
        color: ${token.colorText};
        font-size: 16px;
      }
    `,
    addBtn: css`
      background: #1677ff0f;
      border: 1px solid #1677ff34;
      height: 40px;
    `,
    
    // 🌟 知识库管理区域
    section: css`
      padding: 12px 0;
      margin-bottom: 12px;
      border-bottom: 1px solid ${token.colorBorderSecondary};
    `,
    
    // 🌟 知识库标题区域 - 图标和标题同一行
    sectionHeader: css`
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
      padding: 0 8px;
      
      h4 {
        margin: 0;
        font-size: 14px;
        font-weight: 500;
        color: ${token.colorText};
      }
    `,
    
    // 🌟 知识库列表项 - 可选中，高亮显示
    knowledgeItem: css`
      padding: 8px 12px !important;
      margin-bottom: 4px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      border: 1px solid transparent;
      
      &:hover {
        background-color: ${token.colorBgTextHover};
      }
      
      // 🌟 选中状态高亮
      &:global(.selected) {
        background-color: ${token.colorPrimaryBg};
        border-color: ${token.colorPrimaryBorder};
      }
      
      .ant-list-item-meta {
        align-items: center;
      }
      
      .ant-list-item-meta-avatar {
        margin-right: 8px;
      }
      
      // 🌟 标题不换行，超出省略
      .ant-list-item-meta-title {
        margin-bottom: 2px;
        font-size: 14px;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        
        div {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      
      // 🌟 描述不换行，超出省略
      .ant-list-item-meta-description {
        font-size: 12px;
        color: ${token.colorTextSecondary};
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        
        div {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      
      .ant-list-item-meta-content {
        overflow: hidden;
        min-width: 0;
        flex: 1;
      }
    `,
    
    conversations: css`
      flex: 1;
      overflow-y: auto;
      margin-top: 12px;
      padding: 0;

      .ant-conversations-list {
        padding-inline-start: 0;
      }
    `,
    siderFooter: css`
      border-top: 1px solid ${token.colorBorderSecondary};
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    `,
    // chat list 样式
    chat: css`
      height: 100%;
      width: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      padding-block: ${token.paddingLG}px;
      gap: 16px;
      max-width: 1300px;
      margin: 0 auto;
    `,
    chatPrompt: css`
      .ant-prompts-label {
        color: #000000e0 !important;
      }
      .ant-prompts-desc {
        color: #000000a6 !important;
        width: 100%;
      }
      .ant-prompts-icon {
        color: #000000a6 !important;
      }
    `,
    chatList: css`
      flex: 1;
      overflow: auto;
      padding: 0 145px;
    `,
    loadingMessage: css`
      background-image: linear-gradient(90deg, #ff6b23 0%, #af3cb8 31%, #53b6ff 89%);
      background-size: 100% 2px;
      background-repeat: no-repeat;
      background-position: bottom;
    `,
    placeholder: css`
      padding-top: 32px;
    `,
    // sender 样式
    sender: css`
      width: 100%;
      margin: 0 auto;
      max-width: calc(100% - 290px);
    `,
    speechButton: css`
      font-size: 18px;
      color: ${token.colorText} !important;
    `,
    senderPrompt: css`
      width: 100%;
      margin: 0 auto;
      max-width: calc(100% - 290px);
      color: ${token.colorText};
    `,
    mdContainer: css`
      overflow-wrap: break-word;
      word-wrap: break-word;

      pre code {
        display: block;
        max-width: 100%;
        overflow-x: auto;
        white-space: pre;
      }

      table {
        border-collapse: separate;
        border-spacing: 0;
        width: 100%;
        margin: 16px 0;
        border-radius: 6px;
        overflow: hidden;
        box-shadow: 0 0 0 1px #d0d7de;
      }

      th {
        background-color: #f6f8fa;
        border-bottom: 1px solid #d0d7de;
        border-right: 1px solid #d0d7de;
        padding: 6px 13px;
        font-weight: 600;
        text-align: left;
      }

      th:last-child {
        border-right: none;
      }

      td {
        border-bottom: 1px solid #d0d7de;
        border-right: 1px solid #d0d7de;
        padding: 6px 13px;
        text-align: left;
      }

      td:last-child {
        border-right: none;
      }

      tr:last-child td {
        border-bottom: none;
      }
    `
  }
})