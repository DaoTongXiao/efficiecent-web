import { TypeEnum } from '@/config/constant'
import './Welcome.scss'
import ai_logo from '@/assets/ai.png'
interface WelcomeProps {
  onClickPrompt?: (type: TypeEnum, str: string) => void
}
/**
 * ChatTitle
 * @param param
 * @returns React.FC
 */
export default function WlecomeTitle(_props: WelcomeProps) {

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
      </div>
    </div>
  )
}
