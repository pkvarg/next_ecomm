import { SignUp } from '@clerk/nextjs'
import React from 'react'

const page = () => {
  return (
    <div className="flex justify-center">
      <SignUp />
    </div>
  )
}

export default page
