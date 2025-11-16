import { createStyles } from 'antd-style'

const useChatPromptStyles = createStyles(({ css, token }) => ({
  featureCard: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    background: ${token.colorBgContainer};
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    border: 1px solid ${token.colorBorder};
    transition: box-shadow 0.3s ease, transform 0.2s ease;
    cursor: pointer;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .card-header {
      display: flex;
      align-items: center;

      .card-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        margin-right: 12px;
        font-size: 16px;
        color: #fff;

        &.fire {
          background-color: #ff4d4f;
        }

        &.blue {
          background-color: #1890ff;
        }

        &.purple {
          background-color: #722ed1;
        }
      }
    }

    .card-content {
      p {
        font-size: 14px;
        margin: 0;
        color: ${token.colorTextSecondary};
        line-height: 1.5;
      }
    }
  `
}))

export default useChatPromptStyles