import { createStyles } from 'antd-style'

const useKnowledgeStyles = createStyles(({ css }) => ({
  knowledgeList: css`
    height: 100%;
    overflow-y: auto;
  `,
  knowledgeItem: css`
    cursor: pointer;
    
    &.selected .knowledgeName {
      font-weight: 600;
      color: #1677ff;
    }
  `,
  knowledgeIndex: css`
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
  knowledgeName: css`
    font-size: 13px;
    font-weight: 500;
    color: #1f2933;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `
}))

export default useKnowledgeStyles
