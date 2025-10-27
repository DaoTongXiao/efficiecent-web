import { ApiMessage } from '@/api/conversion/message'
import { TypeEnum } from '@/config/constant'

import { Dispatch, RefObject, ReactNode, SetStateAction } from 'react'

export type BubbleDataType = {
  id: string
  status: string
  role: string
  content_type: string
  content: string[]
}

export type Conversation = {
  key: string
  label: string
  group: string
}

export type MessageType = ApiMessage

export type T = Record<string, string>

export type Topic = {
  key: string
  label: string
  children: {
    key: string
    description: string
    icon: ReactNode
  }[]
}




export type ChatAgent = {
  isRequesting: () => boolean
  [key: string]: unknown
}

export type ChatSiderProps = {
  styles: Record<string, string>
  agent: ChatAgent
  t: T
  conversations: Conversation[]
  setConversations: Dispatch<SetStateAction<Conversation[]>>
  setCurConversation: Dispatch<SetStateAction<string>>
  setMessages: (messages: MessageType[]) => void
  curConversation: string
  abortControllerRef: RefObject<AbortController | null>
  messageHistory: Record<string, MessageType[]>
}

export type PromptState = {
  prompt: string
  attachment: string
  deviceId: string | null
  dateStart: string
  dateEnd: string
  typeStr?: TypeEnum
}