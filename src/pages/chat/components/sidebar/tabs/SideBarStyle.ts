import { createStyles } from 'antd-style'

const useAssistantStyles = createStyles(({ css, token }) => ({
  assistantList: css`
    height: 100%;
    overflow-y: auto;
  `,

  assistantItem: css`
    cursor: pointer;

    &.selected .assistant-name {
      font-weight: 600;
      color: ${token.colorPrimary};
    }
  `,

  assistantIndex: css`
    min-width: 20px;
    height: 20px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
    margin-right: 8px;
    color: #fff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  `,

  assistantName: css`
    font-size: 13px;
    font-weight: 500;
    color: ${token.colorText};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `
}))

export default useAssistantStyles