'use client'

export const saveEmail = (userEmail: string) => {
  if (typeof window !== 'undefined') {
    const existingEmail = localStorage.getItem('userEmail')

    if (existingEmail) {
      localStorage.removeItem('userEmail')
    }
    // Save new email
    localStorage.setItem('userEmail', userEmail)
  }
}

export const userEmail = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userEmail')
  }
  return null // Return null during SSR
}
