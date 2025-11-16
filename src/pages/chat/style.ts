import { createStyles } from 'antd-style'

const useChatStyles = createStyles(({ css, token }) => ({
  chatPage: css`
    display: flex;
    height: calc(-56px + 100vh);

    & .resizable-panel-group {
      height: 100%;
      width: 100%;
      display: flex;

      & .resize-handle {
        border: 1px solid ${token.colorBorder};
      }
    }
  `
}))
export default useChatStyles