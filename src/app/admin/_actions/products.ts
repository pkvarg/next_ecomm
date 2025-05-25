'use server'

import db from '@/db/db'
import { z } from 'zod'
import fs from 'fs/promises'
import { notFound, redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { isAuth, isAuthAdmin } from '@/lib/isAuth'

//const fileSchema = z.instanceof(File, { message: 'Required' })
const fileSchema = z.instanceof(File)
const imageSchema = fileSchema.refine((file) => file.size === 0 || file.type.startsWith('image/'))

const addSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  countInStock: z.coerce.number().int().min(0),
  // file: z.instanceof(File).optional().or(z.null()),
  // image: imageSchema.refine((file) => file.size > 0, 'Required'),
  image: z.string().url(), // Accept URL instead of File
  file: z.string().optional(), // Optional for files
})

export async function addProduct(prevState: unknown, formData: FormData) {
  const isAuthenticated = await isAuthAdmin()
  if (!isAuthenticated) return
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()))
  console.log('here add', result)
  if (result.success === false) {
    return result.error.formErrors.fieldErrors
  }

  const data = result.data

  // CLOUDINARY
  const filePath = data.file ? `${data.file}` : null
  const imagePath = `${data.image}`

  // CLOUDINARY

  // await fs.mkdir('products', { recursive: true })

  // const filePath =
  //   data.file && data.file.size > 0 ? `products/${crypto.randomUUID()}-${data.file.name}` : null

  // if (filePath && data.file) {
  //   await fs.writeFile(filePath, new Uint8Array(Buffer.from(await data.file.arrayBuffer())))
  // }

  // await fs.mkdir('public/products', { recursive: true })
  // const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`

  // await fs.writeFile(
  //   `public${imagePath}`,
  //   new Uint8Array(Buffer.from(await data.image.arrayBuffer())),
  // )

  await db.product.create({
    data: {
      isAvailableForPurchase: false,
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      countInStock: data.countInStock,
      filePath,
      imagePath,
      qty: 0,
    },
  })

  revalidatePath('/')
  revalidatePath('/products')

  redirect('/admin/products')
}

// const editSchema = addSchema.extend({
//   // file: fileSchema.optional(),
//   // image: imageSchema.optional(),
//   image: z.string().url(), // Accept URL instead of File
//   file: z.string().optional(), // Optional for files
// })

const editSchema = z.object({
  name: z.string().min(1),
  priceInCents: z.number().int().positive(),
  description: z.string().min(1),
  countInStock: z.number().int().min(0),
  image: z.string().optional(), // Make optional for updates
  file: z.string().optional(),
})

export async function updateProduct(id: string, prevState: unknown, formData: FormData) {
  const isAuthenticated = await isAuthAdmin()
  if (!isAuthenticated) return

  // Extract values directly from FormData and convert types
  const processedData = {
    name: formData.get('name') as string,
    priceInCents: Number(formData.get('priceInCents')),
    description: formData.get('description') as string,
    countInStock: Number(formData.get('countInStock')),
    image: formData.get('image') as string | null,
    file: formData.get('file') as string | null,
  }

  // Remove null/empty values (MongoDB doesn't like them)
  const cleanedData = Object.fromEntries(
    Object.entries(processedData).filter(
      ([_, value]) => value !== null && value !== undefined && value !== '',
    ),
  )

  const result = editSchema.safeParse(cleanedData)
  console.log('update res', result)

  if (result.success === false) {
    console.log('Validation errors:', result.error.formErrors.fieldErrors)
    return result.error.formErrors.fieldErrors
  }

  const data = result.data
  const product = await db.product.findUnique({ where: { id } })

  if (product == null) return notFound()

  // CLOUDINARY
  let filePath = product.filePath

  if (data.file != null && product.filePath) {
    filePath = `{data.file}`
  }

  let imagePath = product.imagePath

  if (data.image != null) {
    imagePath = `${data.image}`
  }

  await db.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      countInStock: data.countInStock,
      filePath,
      imagePath,
    },
  })

  revalidatePath('/')
  revalidatePath('/products')

  redirect('/admin/products')
}

export async function toggleProductAvailability(id: string, isAvailableForPurchase: boolean) {
  const isAuthenticated = await isAuthAdmin()
  if (!isAuthenticated) return
  await db.product.update({ where: { id }, data: { isAvailableForPurchase } })

  revalidatePath('/')
  revalidatePath('/products')
}

export async function deleteProduct(id: string) {
  const product = await db.product.delete({ where: { id } })

  if (product == null) return notFound()

  if (product.filePath) {
    await fs.unlink(product.filePath)
  }

  if (product.imagePath) {
    await fs.unlink(`public${product.imagePath}`)
  }

  // await fs.unlink(product.filePath)
  // await fs.unlink(`public${product.imagePath}`)

  revalidatePath('/')
  revalidatePath('/products')
}
