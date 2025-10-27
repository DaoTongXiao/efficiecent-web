import { Flex } from 'antd'
import React, { Dispatch, SetStateAction, useCallback } from 'react'
import { T } from '@/types/typing'
import { Sender } from '@ant-design/x' // 假设这是自定义组件
import { ZhPrompts } from '@/components/ZhPrompts/ZhPrompts'
// Props 接口保持不变，但可以考虑进一步细化（如 optional props）
export type ChatSenderProps = {
  styles: Record<string, string>
  eventType: string
  inputValue: string
  loading: boolean

  locales: T

  onSubmit: (val: string) => void
  promptItemOnClick: (val: string) => void
  setInputValue: Dispatch<SetStateAction<string>>
}


// 主组件：现在更专注 UI，逻辑外置
const ChatSender: React.FC<ChatSenderProps> = ({
  styles,
  inputValue,
  loading,
  locales,
  setInputValue,
  onSubmit,
  promptItemOnClick
}) => {
  // 文件变化处理（简化，无需额外逻辑）


  // 提交处理（简化：直接调用 props）
  const handleSubmit = useCallback(() => {
    if (inputValue.trim()) {
      onSubmit(inputValue)
      setInputValue('')
    }
  }, [inputValue, onSubmit, setInputValue])

  return (
    <>
      

      {/* 提示词：独立组件 */}
      <ZhPrompts
        className={styles.senderPrompt}
        onItemClick={promptItemOnClick}
      />

      {/* Sender 输入框：核心 UI，逻辑外置 */}
      <Sender
        value={inputValue}
        disabled={loading} // 添加 dateOpen 禁用，避免冲突
        onSubmit={handleSubmit} // 直接用回调，避免内联
        onChange={setInputValue}
        loading={loading}
        className={styles.sender}
        actions={(_, info) => {
          const { SendButton, LoadingButton } = info.components
          return (
            <Flex gap={4}>
              {loading ? <LoadingButton type="default" /> : <SendButton type="primary" />}
            </Flex>
          )
        }}
        placeholder={locales.askMeAnything}
      />
    </>
  )
}

export default ChatSender
