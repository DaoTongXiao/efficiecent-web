import { UserOutlined } from '@ant-design/icons'
import ailogo from '@/assets/ai.png'
import { RoleEnum } from '@/config/constant'

type Props = {
  role: RoleEnum
}

export const Avatar: React.FC<Props> = ({ role }: Props) => {
  if (role === RoleEnum.USER) {
    return <UserOutlined />
  }
  return <img src={ailogo} />
}
