'use client'
import { contactEmail } from '@/actions/contactEmail'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

const Contact = () => {
  const { register, handleSubmit, watch, reset } = useForm()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const x = process.env.NEXT_PUBLIC_EMAIL_EXTRA_ONE
  const y = process.env.NEXT_PUBLIC_EMAIL_EXTRA_TWO

  const [agree, setAgree] = useState(false)
  const [passwordGroupOne, setPasswordGroupOne] = useState(x)
  const [passwordGroupTwo, setPasswordGroupTwo] = useState(y)
  const [warning, setWarning] = useState('')

  const onSubmit = async (data: object) => {
    setWarning('')
    if (!agree) {
      setWarning('You have to agree with Data processing')
      return
    }

    if (passwordGroupOne !== x || passwordGroupTwo !== y) {
      setWarning('Contact error')

      const element = document.getElementById('contact')
      element?.scrollIntoView({ behavior: 'smooth' })
      return
    }

    setWarning('')

    try {
      const response = await contactEmail(formData)
      console.log('ok', response)

      const element = document.getElementById('contact')
      element?.scrollIntoView({ behavior: 'smooth' })
      setWarning(response)
      setAgree(false)
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      })
    } catch (error) {
      console.error('Failed to send contact email:', error)
      setWarning('Failed to send contact email. Please try again later.')

      const element = document.getElementById('contact')
      element?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[77.5vh] text-black">
      <h1 className="py-8 font-semibold text-[26px]">Contact</h1>
      <h2
        className={
          warning === 'Success' ? 'text-green-600 text-[25px]' : 'text-red-600 text-[30px]'
        }
      >
        {warning}
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 w-fit mt-8"
        id="contact"
      >
        <input
          {...register('name')}
          placeholder="Name"
          value={formData.name}
          required
          className="border pl-1"
          onChange={handleInputChange}
        />
        <input
          {...register('email')}
          placeholder="Email"
          value={formData.email}
          required
          className="border pl-1"
          onChange={handleInputChange}
        />
        <input
          {...register('phone')}
          placeholder="Phone"
          value={formData.phone}
          required
          className="border pl-1"
          onChange={handleInputChange}
        />
        <textarea
          {...register('message')}
          placeholder="Your Message"
          value={formData.message}
          rows={10}
          required
          className="border pl-1"
          onChange={handleInputChange}
        />
        <input
          {...register('passwordGroupOne')}
          value={passwordGroupOne}
          required
          className="hidden"
          onChange={(e) => setPasswordGroupOne(e.target.value)}
        />
        <input
          {...register('passwordGroupTwo')}
          value={passwordGroupTwo}
          required
          className="hidden"
          onChange={(e) => setPasswordGroupTwo(e.target.value)}
        />

        <div className="flex flex-row gap-2 my-4">
          <input
            type="checkbox"
            {...register('agree')}
            className="w-[20px]"
            onChange={(e) => setAgree(e.target.checked)}
          />
          I agree with processing of my Data
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
