import { create } from 'zustand'

export const userStore = create((set) => ({
  user: {
    full_name: 'Petrut Dragut',
  },
  updateUser: (newUser: any) =>
    set((state: any) => ({
      user: { ...state.user, ...newUser },
    })),
  // fetchUser: async () => {
  //   const response = await fetch('/api/user')
  //   const fetchUser = await response.json()
  //   set({ user: fetchUser })
  // },
}))
