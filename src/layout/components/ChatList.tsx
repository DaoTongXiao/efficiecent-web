import React, { useCallback, useMemo, useRef, useEffect } from 'react'
import { Bubble } from '@ant-design/x'
import { Button, GetProp, Space, Spin } from 'antd'
import Welcome from '@/components/ZhWelcome/Welcome'
import { RoleEnum } from '@/config/constant'
import {
  DislikeOutlined,
  LikeOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import { ApiMessage } from '@/api/conversion/message'
import { Avatar } from '@/components/ZhAvatar/Avatar'
import { RolesType } from '@ant-design/x/es/bubble/BubbleList'
import { MessageType} from '@/types/typing'
import { Message } from '@/components/ZhMessage/Message'

export type ChatListProps = {
  styles: Record<string, string>
  messages: MessageType[]
  onPromptClick: (type_str: string) => void
  onFooterButtonClick: (key: string, content: React.ReactElement<{ message: ApiMessage }>, info: string) => void
  onSubmit: (val: string) => void
}
/**
 * ChatList
 * @param param
 * @returns {React.FC}
 */
const ChatList: React.FC<ChatListProps> = ({
  styles,
  messages,
  onPromptClick,
  onFooterButtonClick
}) => {
  const chatContainerRef = useRef<HTMLDivElement>(null)

  /**
   * 滚动到底部
   */
  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [])

  /**
   * 当消息变化时自动滚动到底部
   */
  useEffect(() => {
    // 使用 setTimeout 确保 DOM 更新后再滚动
    const timer = setTimeout(() => {
      scrollToBottom()
    }, 100)
    return () => clearTimeout(timer)
  }, [messages, scrollToBottom])

  /**
   * 显示欢迎界面
   */
  const showWelcome = useCallback(() => {
      return messages.length === 0
  },[messages])

  /**
   * 排序后的消息列表
   */
  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => {
      const timeA = a.create_time ? new Date(a.create_time).getTime() : 0
      const timeB = b.create_time ? new Date(b.create_time).getTime() : 0
      if (timeA !== timeB) return timeA - timeB // 升序，旧的先
      // 时间相同时，user 先于 ai
      if (a.role === RoleEnum.USER && b.role === RoleEnum.AI) return -1
      if (a.role === RoleEnum.AI && b.role === RoleEnum.USER) return 1
      return 0
    })
  }, [messages])
  // roles
  const roles: RolesType = {
    ai: {
      placement: 'start',
      avatar: { icon: <Avatar role={RoleEnum.AI} /> },
      footer: (content, info) => {
        const message = sortedMessages.find(m => m.id === info.key)
        const weight = message?.weight ?? 0
        return (
          <div style={{ display: 'flex' }}>
            <Button
              type="text"
              size="small"
              icon={<ReloadOutlined />}
              onClick={() => onFooterButtonClick('reload',content, info.key as string)}
            />
            <Button
              type="text"
              size="small"
              icon={weight > 0 ? <LikeOutlined style={{ color: '#ff18a6ff' }} /> : <LikeOutlined />}
              onClick={() => onFooterButtonClick('like',content, info.key as string)}
            />
            <Button
              type="text"
              size="small"
              icon={weight < 0 ? <DislikeOutlined style={{ color: '#ff4d4f' }} /> : <DislikeOutlined />}
              onClick={() => onFooterButtonClick('unlike',content, info.key as string)}
            />
          </div>
        )
      },
      loadingRender: () => <Spin size="small" />
    },
    user: {
      placement: 'end',
      avatar: { icon: <Avatar role={RoleEnum.USER} /> }
    }
  }

  // parse message
  const items: GetProp<typeof Bubble.List, 'items'>= sortedMessages.map(
      (item) => {
        const {id, status, role } = item
        return {
          key: id,
          loading: status === 'loading',
          role: role,
          header: role === RoleEnum.AI ? '小智' : '你',
          typing: { step: 2, interval: 50 },
          content: (<Message message={item} styles={styles} />),
          variant: 'filled'
        }
      }
    )
  return (
    <div
      ref={chatContainerRef}
      className={styles.chatList}
      style={{
        height: '100%',
        overflowY: 'auto',
        scrollBehavior: 'smooth'
      }}
    >
      { !showWelcome() ? (
        /* 🌟 消息列表 */
        <Bubble.List
          items={items}
          roles={roles}
          autoScroll
        />
      ) : (
        <Space
          direction="vertical"
          size={16}
          className={styles.placeholder}
        >
          <Welcome onClickPrompt={onPromptClick} />
        </Space>
      )}

    </div>
  )
}

export default ChatList

