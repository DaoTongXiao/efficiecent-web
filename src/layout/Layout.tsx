import React, { useState, useEffect } from 'react'
import ChatList from './components/ChatList'
import ChatSender from './components/sender/Sender'
import ChatSider from './components/ChatSider'
import { zhCN } from '@/locales/locales'
import { useStyle } from './style'
import { useConversationStore, useUserStore } from '@/store'
import { useChatSubmission } from '@/hooks/useChatSubmission' // 新增
import { useMessageActions } from '@/hooks/useMessageActions' // 新增
import { ApiMessage } from '@/api/message'

const locales = zhCN

const Layout: React.FC = () => {
  const { styles } = useStyle()
  const { user_info } = useUserStore()
  const {
    conversations,
    curConversation,
    inputValue,
    loading,
    initializeConversations
  } = useConversationStore()

  // 提取的hooks
  const { submitMessage } = useChatSubmission()
  const { handleMessageAction } = useMessageActions()

  const [eventType, setEventType] = useState('')

  // 改进：监听user_id变化，确保初始化
  useEffect(() => {
    const userId = user_info.user_id
    if (userId) {
      initializeConversations(userId)
    
  }}, [user_info.user_id, initializeConversations]) // 稳定依赖

  // 简化：直接用store的setInputValue（假设它支持函数式更新）
  const handleSetInputValue = (value: string | ((prev: string) => string)) => {
    if (typeof value === 'function') {
      useConversationStore.setState((state) => ({ inputValue: value(state.inputValue) }))
    } else {
      useConversationStore.setState({ inputValue: value })
    }
  }

  // 简化事件处理
  const onPromptClick = (key: string) => {
    console.log('onPromptClick', key)
    setEventType(key)
    console.log('onPromptClick', key)
    // 移除console.log，提升生产DX
  }

  const onFooterButtonClick = (
    key: string,
    _content: React.ReactElement<{ message: ApiMessage }>,
    info: unknown
  ) => {
    handleMessageAction(key, info as string, _content) // 委托给hook
  }

  const onSubmit = (val: string) => {
    submitMessage(val) // 委托给hook
  }

  return (
    <div className={styles.layout}>
      <ChatSider
        styles={styles}
        conversations={conversations}
        curConversation={curConversation}
        locales={locales}
      />

      <div className={styles.chat}>
        <ChatList
          styles={styles}
          messages={useConversationStore((s) => s.messages)} // selector优化，避免全store订阅
          onFooterButtonClick={onFooterButtonClick}
          onPromptClick={onPromptClick}
          onSubmit={onSubmit}
        />
        <ChatSender
          styles={styles}
          eventType={eventType}
          locales={locales}
          loading={loading}
          inputValue={inputValue}
          onSubmit={onSubmit}
          setInputValue={handleSetInputValue}
          promptItemOnClick={onPromptClick}
        />
      </div>
    </div>
  )
}

export default Layout
