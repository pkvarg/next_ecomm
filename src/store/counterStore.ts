import { createJSONStorage, persist } from 'zustand/middleware'
import { create } from 'zustand'

// types
interface CountState {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

const useCountStore = create<CountState>()(
  persist(
    (set) => ({
      // initial state
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () =>
        set((state) => {
          //
          return { count: state.count > 0 ? state.count - 1 : 0 }
        }),
      reset: () => set({ count: 0 }),
    }),
    {
      name: 'count-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)

export default useCountStore
