'use client'
import React from 'react'
import Link from 'next/link'
import CookieConsent from 'react-cookie-consent'
import { updateVisitors } from '@/actions/visitors'

const Footer = () => {
  const increaseVisitors = async () => {
    await updateVisitors()
  }

  const apiUrl = 'https://hono-api.pictusweb.com/api/visitors/nextecommerce/increase'
  //const apiUrl = 'http://localhost:3013/api/visitors/nextecommerce/increase'

  const incrementCount = async () => {
    try {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error('Failed to increment count')
      }
    } catch (err) {
      console.log(err instanceof Error ? err.message : 'An unknown error occurred')
    }
  }

  return (
    <div className="bg-black flex flex-col px-[10%] gap-3 py-4">
      <CookieConsent
        location="bottom"
        style={{
          background: '#3B81F6',
          color: '#ffffff',
          fontSize: '19px',
          textAlign: 'start',
        }}
        buttonStyle={{
          background: '#1d9f2f',
          color: '#fff',
          fontSize: '18px',
          paddingTop: '7px',
          paddingLeft: '40px',
          paddingRight: '40px',
          borderRadius: '20px',
        }}
        buttonText="OK"
        expires={365}
        enableDeclineButton
        onDecline={() => {
          increaseVisitors()
          incrementCount()
        }}
        declineButtonStyle={{
          background: 'red',
          color: '#fff',
          fontSize: '18px',
          paddingTop: '5px',
          borderRadius: '20px',
        }}
        declineButtonText={'I disagree'}
        onAccept={() => {
          increaseVisitors()
          incrementCount()
        }}
      >
        {
          'This page only uses analytical cookies that are necessary for the website to function. We do not use functional or marketing cookies.'
        }
      </CookieConsent>
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
