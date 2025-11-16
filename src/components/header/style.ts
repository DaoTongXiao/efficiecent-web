import { createStyles } from 'antd-style'

const useStyles = createStyles(({ css, token }) => ({
  header: css`
    height: 45px;
    background-color: ${token.colorBgContainer};
    border-bottom: 1px solid ${token.colorBorderSecondary};
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    &[data-theme='dark'] {
      background-color: ${token.colorBgLayout};
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    @media (max-width: 768px) {
      height: 56px;
      padding: 0 16px;
    }
  `,

  headerLeft: css`
    display: flex;
    align-items: center;
    gap: 12px;
  `,

  headerLogo: css`
    width: 32px;
    height: 32px;
  `,

  headerTitle: css`
    font-size: 18px;
    font-weight: 600;
    color: ${token.colorText};

    @media (max-width: 768px) {
      font-size: 16px;
    }
  `,

  headerRight: css`
  `,

  headerUserInfo: css`
    display: flex;
    align-items: center;
    gap: 8px;
  `,

  headerUser: css`
    font-size: 14px;
    color: ${token.colorTextSecondary};

    @media (max-width: 768px) {
      font-size: 12px;
    }
  `
}))

export default useStyles