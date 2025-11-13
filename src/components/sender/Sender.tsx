import { Flex } from 'antd'
import React, { Dispatch, SetStateAction, useCallback } from 'react'
import { T } from '@/types/typing'
import { Sender } from '@ant-design/x'
import './Sender.scss'
export type ChatSenderProps = {
  eventType: string
  inputValue: string
  loading: boolean

  locales: T

  onSubmit: (val: string) => void
  setInputValue: Dispatch<SetStateAction<string>>
}

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

  return (
    <>
      <Sender
        value={inputValue}
        disabled={loading} // 添加 dateOpen 禁用，避免冲突
        onSubmit={handleSubmit} // 直接用回调，避免内联
        onChange={setInputValue}
        loading={loading}
        className="chat-sender"
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
