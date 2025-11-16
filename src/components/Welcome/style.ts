import { createStyles } from 'antd-style'

const useWelcomeStyles = createStyles(({ css, token }) => ({
  container: css`
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;

    .chat-title {
      width: 100%;
      max-width: 800px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .chat-hello {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 8px;

        .x-logo {
          height: 60px;
          line-height: 40px;
          border-radius: 50%;
        }

        .greetings {
          font-size: 28px;
          line-height: 60px;
          font-weight: 900;
          line-height: 40px;
          margin-left: 10px;
        }
      }
    }

    .description {
      text-align: center;
      margin-bottom: 24px;
      color: ${token.colorTextSecondary};
      width: 100%;
      max-width: 800px;
    }
  `,

  featureCards: css`
    display: flex;
    gap: 16px;
    width: 100%;
    max-width: 800px;
    margin-top: 16px;
    justify-content: center;
  `
}))

export default useWelcomeStyles