import { FireOutlined, FundOutlined, ReadOutlined } from '@ant-design/icons'
import { Prompts, PromptProps } from '@ant-design/x'
import { GetProp } from 'antd'
import { TypeEnum } from '@/config/constant'

const senderPromptsItems: GetProp<typeof Prompts, 'items'> = [
  {
    key: 'productStatus',
    description: '智能报销',
    icon: <FireOutlined style={{ color: '#FF4D4F' }} />
  },
  {
    key: 'batchOverview',
    description: '公司规章制度',
    icon: <ReadOutlined style={{ color: '#1890FF' }} />
  },
  {
    key: 'waferMapConfig',
    description: '业务系统',
    icon: <ReadOutlined style={{ color: '#722ED1' }} />
  },
  {
    key: 'dailyReport',
    description: '我的工作',
    icon: <FundOutlined style={{ color: '#722ED1' }} />
  }
]

type Props = {
  className?: string
  onItemClick?: (type: TypeEnum, title: string) => void
}

export const ZhPrompts: React.FC<Props> = (props: Props) => {
  const onClick = (v: { data: PromptProps }) => {
    if(props?.onItemClick){
         props?.onItemClick(v.data.key as TypeEnum, v.data.description as string || '')
    }
  }
  return <Prompts className={props?.className} items={senderPromptsItems} onItemClick={onClick} />
}

