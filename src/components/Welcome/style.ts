import { createStyles } from 'antd-style'

const useWelcomeStyles = createStyles(({ css, token }) => ({
  container: css`
    display: flex;
    align-items: center;
    justify-content: left;
    width: 100%;
    padding: 16px 5px;
    background: linear-gradient(
      135deg,
      ${token.colorBgContainer} 0%,
      rgba(255, 255, 255, 0.8) 100%
    );
    // border-radius: 24px;
    // box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    // backdrop-filter: blur(20px);
    // border: 1px solid rgba(255, 255, 255, 0.2);

    .chat-title {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;

      .chat-hello {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 24px;

        .x-logo {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
          transition: transform 0.3s ease;

          &:hover {
            transform: scale(1.05);
          }
        }

        .greetings {
          font-size: 36px;
          font-weight: 900;
          background: linear-gradient(
            135deg,
            ${token.colorPrimary} 0%,
            ${token.colorInfo} 50%,
            ${token.colorSuccess} 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          line-height: 1.2;
          letter-spacing: -0.02em;
          text-align: center;
        }
      }

      .description {
        text-align: center;
        color: ${token.colorTextDescription};
        font-size: 18px;
        line-height: 1.6;
        max-width: 700px;
        opacity: 0.9;
      }
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
