import useCountStore from '@/store/counterStore'
import React from 'react'

const ProdCount = () => {
  const { count, increment, decrement, reset } = useCountStore((state) => state)

  return (
    <div className='flex gap-4 text-[20px]'>
      <p onClick={decrement} className='cursor-pointer'>
        -
      </p>
      <h1>{count}</h1>

      <p onClick={increment} className='cursor-pointer'>
        +
      </p>
      {/* <p onClick={reset} className='cursor-pointer'>Reset</p> */}
    </div>
  )
}

export default ProdCount
