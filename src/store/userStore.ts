import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type FiledType = string | number | null

type UserInfo = {
  user_id: FiledType
  user_name: FiledType
  company_code: FiledType
  business_id: FiledType
}

interface UserState {
  token: string
  user_info: UserInfo
  setInfo: (info: UserInfo) => void
  setToken: (token: string) => void
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      token: '',
      user_info: {
        user_id: null,
        user_name: null,
        company_code: null,
        business_id: null
      },
      setInfo: (info: UserInfo) => {
        set({ user_info: info })
      },
      setToken: (token: string) => set({ token })
    }),
    {
      name: 'user-info-storage',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)

export default useUserStore
