import React from 'react'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Send, Paperclip, Mic, Image, Smile } from 'lucide-react'
import useStyles from './style'

interface ChatInputBoxProps {
  inputValue: string
  onSubmit: (val: string) => void
  loading: boolean
  setInputValue: (value: string) => void
}



const ChatInputBox: React.FC<ChatInputBoxProps> = ({ onSubmit }) => {
  const { styles } = useStyles()

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: {},
        blockquote: {},
        bulletList: {},
        orderedList: {}
      }),
      Placeholder.configure({
        placeholder: '输入消息... (Shift+Enter 换行)'
      })
    ],
    editorProps: {
      handleKeyDown: (_view, event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault()
          handleSend()
          return true
        }
        return false
      },
      attributes: {
        style: 'outline: none; border: none;'
      }
    }
  })

  const handleSend = () => {
    if (!editor || editor.isEmpty) return

    const content = editor.getText().trim()
    if (!content) return

    onSubmit(content)
    editor.commands.clearContent()
  }

  const isDisabled = !editor || editor.isEmpty

  return (
    <div className={styles.containerOuter}>
      <div className={styles.containerInner}>
        <div className={styles.inputContainer}>
          <div className={styles.editorWrapper}>
            <div className={styles.editor}>
              <EditorContent editor={editor} />
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.toolbar}>
            <div className={styles.tools}>
              <button className={styles.toolButton} title="添加附件">
                <Paperclip size={20} />
              </button>
              <button className={styles.toolButton} title="添加图片">
                <Image size={20} />
              </button>
              <button className={styles.toolButton} title="表情">
                <Smile size={20} />
              </button>
              <button className={styles.toolButton} title="语音输入">
                <Mic size={20} />
              </button>
            </div>

            <div className={styles.rightSection}>
              <span className={styles.hint}>Shift + Enter 换行</span>
              <button
                className={styles.sendButton}
                onClick={handleSend}
                disabled={isDisabled}
              >
                <Send size={18} />
                <span>发送</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInputBox
