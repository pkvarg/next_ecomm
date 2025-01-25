import React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
    <div className="bg-black flex flex-col px-[10%] gap-3 py-4">
      <Link href={'/contact'} className="flex-nowrap text-gray-400">
        Contact
      </Link>
      <p className="text-gray-400 text-center">
        Copyright &copy; {Date().substring(11, 15)}
        Pictusweb Development
      </p>
    </div>
  )
}

export default Footer
