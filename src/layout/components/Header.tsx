import React from 'react'
import { useUserStore } from '@/store'
import logo from '@/assets/logo.ico'
import './Header.scss'

const Header: React.FC = () => {
  const { user_info } = useUserStore()

  return (
    <div className="header">
      <div className="header-left">
        <img src={logo} alt="Logo" className="header-logo" />
        <span className="header-title">AI Chat System</span>
      </div>
      <div className="header-right">
        <span className="header-user">欢迎, {user_info.user_name || '用户'}</span>
      </div>
    </div>
  )
}

export default Header