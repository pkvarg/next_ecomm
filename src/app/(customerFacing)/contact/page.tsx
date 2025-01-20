'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

const Contact = () => {
  const { register, handleSubmit, watch, reset } = useForm()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [agree, setAgree] = useState(false)

  const onSubmit = (data: object) => {
    //setShippingInfo(data)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[77.5vh]">
      <h1 className="py-14 font-semibold text-[26px]">Contact</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 w-fit">
        <input
          {...register('name')}
          placeholder="Name"
          value={name}
          required
          className="border pl-1"
        />
        <input
          {...register('email')}
          placeholder="Email"
          value={email}
          required
          className="border pl-1"
        />
        <input
          {...register('phone')}
          placeholder="Phone"
          value={phone}
          required
          className="border pl-1"
        />
        <textarea
          {...register('message')}
          placeholder="Your Message"
          value={message}
          rows={10}
          required
          className="border pl-1"
        />

        <div className="flex flex-row gap-2 my-4">
          <input type="checkbox" {...register('agree')} className="w-[20px]" />I agree with
          processing of my Data
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-gray-50 p-2 w-fit cursor-pointer hover:bg-blue-800 mt-8 ml-auto"
        >
          Send
        </button>
      </form>
    </div>
  )
}

export default Contact
