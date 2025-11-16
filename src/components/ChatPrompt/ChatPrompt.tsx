import { TypeEnum } from '../../config/constant.ts'
import useChatPromptStyles from './style.ts'

interface ChatPromptProps {
  type: TypeEnum
  title: string
  description: string
  icon: React.ReactNode
  iconColor?: string
  onClick?: (type: TypeEnum, title: string) => void
}

const ChatPrompt = (props: ChatPromptProps) => {
  const { styles } = useChatPromptStyles()

  return (
    <>
      <div
        className={styles.featureCard}
        onClick={() => {
          if (props.onClick) {
            props.onClick(props.type, props.title)
          }
        }}
      >
        <div className="card-header">
          <div className={'card-icon ' + props.iconColor}>{props.icon}</div>
          <h3>{props.title}</h3>
        </div>
        <div className="card-content">
          <p>{props.description}</p>
        </div>
      </div>
    </>
  )
}

export default ChatPrompt
