import { createStyles } from 'antd-style'

const useStyles = createStyles(({ css, token }) => ({
  layout: css`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;
    overflow: hidden;
  `,

  layoutBody: css`
    flex: 1;
    display: grid;
    grid-template-columns: 45px 1fr;
    border-top: 1px solid #eee;
    background: ${token.colorBgContainer};
    overflow: hidden;

    @media (max-width: 1024px) {
      grid-template-columns: 40px 280px 1fr;
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr;
    }
  `,

  toolbar: css`
    background-color: ${token.colorBgContainer};
    border-right: 1px solid ${token.colorBorderSecondary};
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
    background: ${token.colorPrimaryBgHover};
    border: 1px solid ${token.colorPrimaryBorder};
    height: 40px;
  `,

  section: css`
    padding: 12px 0;
    margin-bottom: 12px;
    border-bottom: 1px solid ${token.colorBorderSecondary};
  `,

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

  loadingMessage: css`
    background-image: linear-gradient(
      90deg,
      #ff6b23 0%,
      #af3cb8 31%,
      #53b6ff 89%
    );
    background-size: 100% 2px;
    background-repeat: no-repeat;
    background-position: bottom;
  `,

  placeholder: css`
    padding-top: 32px;
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
  `,

  resizablePanelGroup: css`
    display: contents;
  `,

  resizeHandle: css`
    width: 4px;
    background: transparent;
    transition: background-color 0.2s ease;
    cursor: col-resize;
    position: relative;

    &:hover {
      background: ${token.colorBorderSecondary};
    }

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 2px;
      height: 20px;
      background: ${token.colorBorderSecondary};
      border-radius: 1px;
    }
  `,

  sidebarPanel: css`
    display: flex;
    flex-direction: column;
    overflow: hidden;
  `,

  mainPanel: css`
    display: flex;
    flex-direction: column;
    overflow: hidden;
  `,

  // Responsive media queries for mobile
  '@media (max-width: 768px)': {
    resizablePanelGroup: css`
      display: none;
    `,
    sider: css`
      display: none;
    `
  }
}))

export default useStyles