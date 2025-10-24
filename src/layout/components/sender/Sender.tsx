import { Button, Flex, Space } from 'antd'
import React, { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { UploadChangeParam, UploadFile } from 'antd/es/upload'
import { PaperClipOutlined } from '@ant-design/icons'
import { T } from '@/types/typing'
import DeviceSelector from '@/components/Business/DeviceSelector/DeviceSelector'
import DateSelector from '@/components/DateSelector/DateSelector'

import { Sender } from '@ant-design/x' // 假设这是自定义组件
import SenderHeader from './SenderHeader'
import { ZhPrompts } from '@/components/ZhPrompts/ZhPrompts'
import { useDateSelectAction, useDeviceSelectAction} from './useAction'
// Props 接口保持不变，但可以考虑进一步细化（如 optional props）
export type ChatSenderProps = {
  styles: Record<string, string>
  eventType: string
  inputValue: string
  loading: boolean
  deviceOpen: boolean
  dateOpen: boolean
  locales: T
  closeDeviceSelector: () => void
  closeDateSelector: () => void
  onSubmit: (val: string) => void
  promptItemOnClick: (val: string) => void
  setInputValue: Dispatch<SetStateAction<string>>
}


// 主组件：现在更专注 UI，逻辑外置
const ChatSender: React.FC<ChatSenderProps> = ({
  styles,
  eventType,
  inputValue,
  loading,
  locales,
  deviceOpen,
  dateOpen,
  closeDeviceSelector,
  closeDateSelector,
  setInputValue,
  onSubmit,
  promptItemOnClick
}) => {
  const [headerOpen, setHeaderOpen] = useState(false)

  // 使用提取的 hook
  const { saveDateSelector } = useDateSelectAction(closeDateSelector)
  const { saveDeviceSelector } = useDeviceSelectAction(eventType,closeDeviceSelector)

  // 文件变化处理（简化，无需额外逻辑）
  const handleFileChange = useCallback((info: UploadChangeParam<UploadFile<unknown>>) => {
    console.log('file', info) // 建议替换为实际上传逻辑
  }, [])

  // 切换 header 打开状态（简化逻辑：互斥打开）
  const toggleHeaderOpen = useCallback((open: boolean) => {
    setHeaderOpen(open)
    if (open) {
      closeDeviceSelector() // 关闭设备选择器，避免冲突
    }
  }, [closeDeviceSelector])

  // 提交处理（简化：直接调用 props）
  const handleSubmit = useCallback(() => {
    if (inputValue.trim()) {
      onSubmit(inputValue)
      setInputValue('')
    }
  }, [inputValue, onSubmit, setInputValue])

  return (
    <>
      {/* 设备选择器：条件渲染，props 简洁 */}
      {deviceOpen && (
        <DeviceSelector
          eventType={eventType}
          visible={deviceOpen}
          close={closeDeviceSelector}
          save={saveDeviceSelector}
        />
      )}

      {/* 日期选择器：使用 hook 处理 save */}
      {dateOpen && (
        <DateSelector
          visible={dateOpen}
          close={closeDateSelector}
          save={saveDateSelector}
        />
      )}

      {/* 提示词：独立组件 */}
      <ZhPrompts
        className={styles.senderPrompt}
        onItemClick={promptItemOnClick}
      />

      {/* Sender 输入框：核心 UI，逻辑外置 */}
      <Sender
        value={inputValue}
        disabled={deviceOpen || dateOpen || loading} // 添加 dateOpen 禁用，避免冲突
        header={
          <SenderHeader
            open={headerOpen}
            onOpenChange={toggleHeaderOpen}
            onFileChange={handleFileChange}
          />
        }
        onSubmit={handleSubmit} // 直接用回调，避免内联
        onChange={setInputValue}
        loading={loading}
        className={styles.sender}
        prefix={
          <Space>
            <Button
              type="text"
              icon={<PaperClipOutlined />}
              onClick={() => toggleHeaderOpen(!headerOpen)} // 简化：toggle 而非 change
            />
          </Space>
        }
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
