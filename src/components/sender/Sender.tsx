import { Flex } from 'antd'
import { createStyles } from 'antd-style'
import React, { Dispatch, SetStateAction, useCallback } from 'react'
import { T } from '@/types/typing'
import { Sender } from '@ant-design/x'
export type ChatSenderProps = {
  eventType: string
  inputValue: string
  loading: boolean

  locales: T

  onSubmit: (val: string) => void
  setInputValue: Dispatch<SetStateAction<string>>
}

const useChatSenderStyles = createStyles(({ css, token }) => ({
  chatSender: css`
    max-width: calc(100% - 280px);
    width: 100%;
    margin: 18px auto 0;
    padding: 8px 12px;
    border-radius: 12px;
    background-color: ${token.colorBgContainer};
    border: 1px solid ${token.colorBorder};
    box-shadow: 0 4px 18px rgba(15, 23, 42, 0.12);
    transition: all 0.18s ease-in-out;
  `
}))
// 主组件：现在更专注 UI，逻辑外置
const ChatSender: React.FC<ChatSenderProps> = ({
  inputValue,
  loading,
  locales,
  setInputValue,
  onSubmit
}) => {
  const handleSubmit = useCallback(() => {
    if (inputValue.trim()) {
      onSubmit(inputValue)
      setInputValue('')
    }
  }, [inputValue, onSubmit, setInputValue])

  const { styles } = useChatSenderStyles()

  return (
    <>
      <Sender
        value={inputValue}
        disabled={loading} // 添加 dateOpen 禁用，避免冲突
        onSubmit={handleSubmit} // 直接用回调，避免内联
        onChange={setInputValue}
        loading={loading}
        className={styles.chatSender}
        actions={(_, info) => {
          const { SendButton, LoadingButton } = info.components
          return (
            <Flex gap={4}>
              {loading ? (
                <LoadingButton type="default" />
              ) : (
                <SendButton type="primary" />
              )}
            </Flex>
          )
        }}
        placeholder={locales.askMeAnything}
      />
    </>
  )
}

export default ChatSender
