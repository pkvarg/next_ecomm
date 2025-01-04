import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface UserState {
  email: string
  id: string
  addUser: (email: string, id: string) => void
  resetUser: () => void
}

const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      email: '',
      id: '',
      addUser: (email: string, id: string) => {
        set({ email, id })
      },
      resetUser: () => {
        set({ email: '', id: '' })
      },
    }),
    {
      name: 'user-storage', // The name for the storage key
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

export default useUserStore
