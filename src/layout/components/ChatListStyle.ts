import { createStyles } from 'antd-style'

const useChatListStyle = createStyles(({ css }) => ({
  chatContainer: css`
    height: 100%;
    overflow-y: auto;
    scroll-behavior: smooth;
  `,
  welcomeContainer: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 15px;
  `,
  footer: css`
    display: flex;
  `,
  collectedIcon: css`
    color: #1890ff;
  `,
  likedIcon: css`
    color: #52c41a;
  `,
  dislikedIcon: css`
    color: #ff4d4f;
  `
}))

export default useChatListStyle
