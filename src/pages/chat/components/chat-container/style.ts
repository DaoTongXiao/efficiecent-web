import { createStyles } from 'antd-style'

const useStyles = createStyles(({ css }) => ({
  chatContainer: css`
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding-block: var(--ant-padding-lg);
    height: calc(100vh - 76px);
    gap: 16px;
    margin: 0 auto;
    padding: 0 45px;
  `,

  chatList: css`
    flex: 1;
    overflow: auto;
  `,

  // Sender 固定在容器底部且完全可见
  chatSender: css`
    flex-shrink: 0;
  `
}))

export default useStyles
