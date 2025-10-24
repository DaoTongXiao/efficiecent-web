import { AppstoreOutlined, FireOutlined, FundOutlined, ReadOutlined } from '@ant-design/icons'
import { TypeEnum } from '@/config/constant'
import ChatPrompt from '../ZhChatPrompt/ChatPrompt'
import './style.scss'
import ai_logo from '@/assets/ai.png'
interface WelcomeProps {
  onClickPrompt?: (type: TypeEnum, str: string) => void
}
/**
 * ChatTitle
 * @param param
 * @returns React.FC
 */
export default function WlecomeTitle(props: WelcomeProps) {
  const prompts = [
    {
      key: TypeEnum.ProductStatus,
      title: '智能报销',
      description:
        '智能报销系统，自动化处理报销流程，提高效率，减少错误，确保财务合规。',
      icon: <FireOutlined />,
      iconColor: 'fire '
    },
    {
      key: TypeEnum.BatchOverview,
      title: '公司规章制度',
      description:
        '查看和管理公司规章制度，确保员工了解最新政策，促进合规和透明。',
      icon: <ReadOutlined />,
      iconColor: 'blue '
    },
    {
      key: TypeEnum.WaferMapConfig,
      title: '业务系统',
      description:
        '集成业务系统，提供全面的业务管理解决方案，支持流程自动化和数据分析。',
      icon: <AppstoreOutlined />,
      iconColor: 'purple '
    },
    {
      key: TypeEnum.DailyReport,
      title: '我的工作',
      description:
        '管理个人工作任务，跟踪进度和优先级，提高工作效率和组织性。',
      icon: <FundOutlined />,
      iconColor: 'purple '
    }
  ]

  return (
    <div className="container">
      <div className="chat-title">
        <div className="chat-hello">
          <img
            src={ai_logo}
            height={40}
            alt="x Insight"
            className="x-logo"
          />
          <span className="greetings">你好, 我是你的个人智慧引擎</span>
        </div>
        <div className="description">
          作为你的智能伙伴, 询问我,了解更多。
        </div>
        <div className="feature-cards">
          {prompts.map(prompt => (
            <ChatPrompt
              key={prompt.key}
              type={prompt.key}
              title={prompt.title}
              description={prompt.description}
              icon={prompt.icon}
              iconColor={prompt.iconColor}
              onClick={props?.onClickPrompt}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
