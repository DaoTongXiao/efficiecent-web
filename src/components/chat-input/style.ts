import { createStyles } from 'antd-style'
const useStyles = createStyles(({ css, token }) => ({
  containerOuter: css`
    width: 100%;
    min-height: 120px;
    max-height: 300px;
    box-sizing: border-box;
  `,

  containerInner: css`
    width: 100%;
    margin: 0 auto;
    height: 100%;
    box-sizing: border-box;
  `,

  inputContainer: css`
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    border: 1px solid #e2e8f0;
    transition: all 0.3s ease;
    height: 100%;
    display: flex;
    flex-direction: column;

    &:focus-within {
      border-color: #3b82f6;
      box-shadow:
        0 10px 40px rgba(59, 130, 246, 0.15),
        0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    &:hover {
      box-shadow: 0 12px 45px rgba(0, 0, 0, 0.1);
    }
  `,

  editorWrapper: css`
    position: relative;
    flex: 1;
    min-height: 0;
  `,

  editor: css`
    font-family:
      -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    padding: 16px;
    height: 100%;
    overflow-y: auto;
    outline: none;

    .ProseMirror {
      outline: none !important;
      border: none !important;

      &:focus {
        outline: none !important;
        border: none !important;
        box-shadow: none !important;
      }

      p.is-editor-empty:first-child::before {
        color: #94a3b8;
        content: attr(data-placeholder);
        float: left;
        height: 0;
        pointer-events: none;
      }

      p {
        margin: 0;
        padding: 4px 0;
      }

      code {
        background-color: #f1f5f9;
        padding: 2px 6px;
        border-radius: 4px;
        font-family: 'Monaco', 'Courier New', monospace;
        font-size: 0.9em;
      }

      pre {
        background-color: #1e293b;
        color: #e2e8f0;
        padding: 12px;
        border-radius: 8px;
        overflow-x: auto;

        code {
          background: none;
          padding: 0;
          color: inherit;
        }
      }

      blockquote {
        border-left: 3px solid #3b82f6;
        padding-left: 12px;
        margin: 8px 0;
        color: #64748b;
      }

      ul,
      ol {
        padding-left: 24px;
        margin: 8px 0;
      }

      li {
        margin: 4px 0;
      }
    }

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  `,

  divider: css`
    border-top: 1px solid #e2e8f0;
  `,

  toolbar: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    background: linear-gradient(to right, #f8fafc, white);
  `,

  tools: css`
    display: flex;
    align-items: center;
    gap: 4px;
  `,

  toolButton: css`
    padding: 10px;
    color: #64748b;
    border-radius: 10px;
    transition: all 0.2s ease;
    border: none;
    background: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      color: #3b82f6;
      background-color: #eff6ff;
      transform: scale(1.05);
    }

    &:active {
      transform: scale(0.98);
    }
  `,

  rightSection: css`
    display: flex;
    align-items: center;
    gap: 12px;
  `,

  hint: css`
    font-size: 12px;
    color: #94a3b8;

    @media (max-width: 640px) {
      display: none;
    }
  `,

  sendButton: css`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 24px;
    background: ${token.colorPrimary};
    color: white;
    border-radius: 12px;
    border: none;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);

    &:hover:not(:disabled) {
      background: ${token.colorPrimaryHover};
      box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
      transform: translateY(-1px);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }

    &:disabled {
      background: ${token.colorPrimary};
      cursor: not-allowed;
      box-shadow: none;
      opacity: 0.4;
    }
  `
}))

export default useStyles
