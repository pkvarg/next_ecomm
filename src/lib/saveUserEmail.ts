'use client'

export const saveEmail = (userEmail: string) => {
  const existingEmail = localStorage.getItem('userEmail')

  if (existingEmail) {
    localStorage.removeItem('userEmail')
    console.log('Old email removed:', existingEmail)
  }
  // Save new email
  localStorage.setItem('userEmail', userEmail)
  console.log('New email saved:', userEmail)
}

export const userEmail = () => {
  return localStorage.getItem('userEmail')
}
