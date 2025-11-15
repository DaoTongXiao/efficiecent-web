import React, { useState } from 'react'
import ChatList from '@/layout/components/ChatList'
import { useConversationStore } from '@/store'
import { useChatSubmission } from '@/hooks/useChatSubmission'
import { useMessageActions } from '@/hooks/useMessageActions'
import { ApiMessage } from '@/api/conversion/message'
import useStyles from './style'
import ChatInputBox from '@/components/chat-input'

const ChatContainer: React.FC = () => {
  const { messages, inputValue, loading } = useConversationStore()
  const { submitMessage } = useChatSubmission()
  const { handleMessageAction } = useMessageActions()
  const [eventType, setEventType] = useState('')
  const { styles } = useStyles()

  const handleSetInputValue = (value: string | ((prev: string) => string)) => {
    if (typeof value === 'function') {
      useConversationStore.setState((state) => ({
        inputValue: value(state.inputValue)
      }))
    } else {
      useConversationStore.setState({ inputValue: value })
    }
  }

  const onPromptClick = (key: string) => {
    setEventType(key)
    console.log('onPromptClick', eventType)
  }

  const onFooterButtonClick = (
    key: string,
    _content: React.ReactElement<{ message: ApiMessage }>,
    info: unknown
  ) => {
    handleMessageAction(key, info as string, _content)
  }

  const onSubmit = (val: string) => {
    submitMessage(val)
  }

  return (
    <div className={styles.chatContainer}>
      <ChatList
        messages={messages}
        onFooterButtonClick={onFooterButtonClick}
        onPromptClick={onPromptClick}
        onSubmit={onSubmit}
      />
      <ChatInputBox
        onSubmit={onSubmit}
        inputValue={inputValue}
        loading={loading}
        setInputValue={handleSetInputValue}
      />
    </div>
  )
}

export default ChatContainer
