import dayjs from 'dayjs'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type Device = {
  id: string
  name: string | number
}

// 定义store 类型
export type State = {
  devices: Device[]
  expire: string | number
  setData: (devices: Device[]) => void
  clearData: () => void
}

/**
 * Store - 用于存储和管理一些默认数据
 * 使用 persist 中间件将数据持久化到 localStorage
 */
const useDeviceStore = create<State>()(
  persist(
    set => ({
      devices: [],
      expire: dayjs().add(30, 'm').unix(),
      setData: devices => set({ devices }),
      clearData: () => set({ devices: [] })
    }),
    {
      name: 'default-storage', // localStorage 中的键名
      storage: createJSONStorage(() => localStorage)
    }
  )
)

export default useDeviceStore
