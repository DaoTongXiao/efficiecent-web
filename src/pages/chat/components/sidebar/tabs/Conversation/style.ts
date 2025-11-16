import { createStyles } from 'antd-style'

const useConversationStyles = createStyles(({ css, token }) => ({
  conversationTab: css`
    .create-conversation {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 8px;
      margin: 0 8px 8px 8px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      color: ${token.colorPrimary};
      background-color: ${token.colorPrimaryBg};
      cursor: pointer;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
    }

    .conversations .ant-conversations-item {
      padding: 0 8px;
    }
  `
}))

export default useConversationStyles
