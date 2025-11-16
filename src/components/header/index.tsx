import React from 'react'
import { Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useUserStore } from '@/store'
import logo from '@/assets/logo.ico'
import useStyles from './style'

const Header: React.FC = () => {
  const { user_info } = useUserStore()
  const { styles } = useStyles()

  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <img src={logo} alt="Logo" className={styles.headerLogo} />
        <span className={styles.headerTitle}>AI Chat System</span>
      </div>
      <div className={styles.headerRight}>
        <div className={styles.headerUserInfo}>
          <span className={styles.headerUser}>欢迎, {user_info.user_name || '用户'}</span>
          <Avatar size="small" icon={<UserOutlined />} />
        </div>
      </div>
    </div>
  )
}

export default Header