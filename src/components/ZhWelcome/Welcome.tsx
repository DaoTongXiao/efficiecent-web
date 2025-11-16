import { TypeEnum } from '@/config/constant'
import useWelcomeStyles from './style.ts'
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
  const { styles } = useWelcomeStyles()

  return (
    <div className={styles.container}>
      <div className="chat-title">
        <div className="chat-hello">
          <img
            src={ai_logo}
            height={40}
            alt="x Insight"
            className="x-logo"
          />
          <span className="greetings">你好, 我是你的个人智慧引擎,小智</span>
        </div>
        <div className="description">
          作为你的智能伙伴, 你可以询问我任何问题, 获取帮助; 有问题,就会有答案。
        </div>
      </div>
    </div>
  )
}
