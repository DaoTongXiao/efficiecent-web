import { CloudUploadOutlined } from '@ant-design/icons'
import { Attachments, Sender } from '@ant-design/x'
import { UploadChangeParam, UploadFile } from 'antd/es/upload'
import React from 'react'

type SenderHeaderProps = {
  open: boolean
  onOpenChange?: (open: boolean) => void | undefined
  onFileChange?: (info: UploadChangeParam<UploadFile<unknown>>) => void | undefined
  onCloseTool?: () => void
}

const SenderHeader: React.FC<SenderHeaderProps> = ({
  open,
  onOpenChange,
  onFileChange
}: SenderHeaderProps) => {
  return (
    <Sender.Header
      title="文件上传"
      open={open}
      onOpenChange={onOpenChange}
      styles={{
        content: {
          padding: 0
        }
      }}
    >
      <Attachments
        accept="image/jpeg, image/png"
        maxCount={1}
        onChange={onFileChange}
        beforeUpload={() => false}
        placeholder={type =>
          type === 'drop'
            ? { title: '上传文件' }
            : {
                icon: <CloudUploadOutlined />,
                title: '上传文件',
                description: '点击或拖拽文件到此区域'
              }
        }
      />
    </Sender.Header>
  )
}

export default SenderHeader
