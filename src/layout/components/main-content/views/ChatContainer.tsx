import React, { useState } from 'react'
import ChatList from '../../ChatList'
import ChatSender from '../../sender/Sender'
import { zhCN } from '@/locales/locales'
import { useConversationStore } from '@/store'
import { useChatSubmission } from '@/hooks/useChatSubmission'
import { useMessageActions } from '@/hooks/useMessageActions'
import { ApiMessage } from '@/api/conversion/message'

const ChatContainer: React.FC = () => {
  const { messages, inputValue, loading } = useConversationStore()
  const { submitMessage } = useChatSubmission()
  const { handleMessageAction } = useMessageActions()
  const [eventType, setEventType] = useState('')

  const handleSetInputValue = (value: string | ((prev: string) => string)) => {
    if (typeof value === 'function') {
      useConversationStore.setState((state) => ({ inputValue: value(state.inputValue) }))
    } else {
      useConversationStore.setState({ inputValue: value })
    }
  }

  const onPromptClick = (key: string) => {
    setEventType(key)
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
    <div className="chat-container">
      <ChatList
        styles={{}} // TODO: 从Layout传递样式
        messages={messages}
        onFooterButtonClick={onFooterButtonClick}
        onPromptClick={onPromptClick}
        onSubmit={onSubmit}
      />
      <ChatSender
        styles={{}} // TODO: 从Layout传递样式
        eventType={eventType}
        locales={zhCN}
        loading={loading}
        inputValue={inputValue}
        onSubmit={onSubmit}
        setInputValue={handleSetInputValue}
        promptItemOnClick={onPromptClick}
      />
    </div>
  )
}

export default ChatContainer