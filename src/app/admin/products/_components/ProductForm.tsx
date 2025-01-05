'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatCurrency } from '@/lib/formatters'
import { useState } from 'react'
import { addProduct, updateProduct } from '../../_actions/products'
import { useFormState, useFormStatus } from 'react-dom'
import { Product } from '@prisma/client'
import Image from 'next/image'
import CloudinaryImageUploader from '@/components/UploadProductsImage'
import CloudinaryFileUploader from '@/components/UploadProductFile'

export function ProductForm({ product }: { product?: Product | null }) {
  const [error, action] = useFormState(
    product == null ? addProduct : updateProduct.bind(null, product.id),
    {},
  )

  const [priceInCents, setPriceInCents] = useState<number | undefined>(product?.priceInCents)
  const [countInStock, setCountInStock] = useState<number | undefined>(product?.countInStock!)

  // CLOUDINARY
  const [uploadedFileUrl, setUploadedFileUrl] = useState('')
  const [uploadedImageUrl, setUploadedImageUrl] = useState('')

  console.log('err act', error, action, uploadedFileUrl, uploadedImageUrl)

  const handleUploadImageComplete = (url: string) => {
    setUploadedImageUrl(url)
    console.log('img', uploadedImageUrl)
  }

  const handleUploadFileComplete = (url: string) => {
    setUploadedFileUrl(url)
    console.log('fil', uploadedFileUrl)
  }

  return (
    <form action={action} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input type="text" id="name" name="name" required defaultValue={product?.name || ''} />
        {error.name && <div className="text-destructive">{error.name}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="priceInCents">Price In Cents</Label>
        <Input
          type="number"
          id="priceInCents"
          name="priceInCents"
          required
          value={priceInCents}
          onChange={(e) => setPriceInCents(Number(e.target.value) || undefined)}
        />
        <div className="text-muted-foreground">{formatCurrency((priceInCents || 0) / 100)}</div>
        {error.priceInCents && <div className="text-destructive">{error.priceInCents}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          defaultValue={product?.description ?? ''}
        />
        {error.description && <div className="text-destructive">{error.description}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="count_in_stock">Count in Stock</Label>
        <Input
          type="number"
          id="count_in_stock"
          name="countInStock"
          required
          value={countInStock || ''}
          onChange={(e) => setCountInStock(Number(e.target.value) || undefined)}
        />
        {error.countInStock && <div className="text-destructive">{error.countInStock}</div>}
      </div>

      {product?.imagePath && uploadedImageUrl === '' && (
        <div>
          <label>Product Image</label>
          <Image src={product.imagePath} height="400" width="400" alt="Product Image" />
        </div>
      )}

      {product?.filePath && uploadedFileUrl === '' && (
        <div>
          <label>Product File Path</label>
          <p>{product.filePath}</p>
        </div>
      )}

      {/* CLOUDINARY IMAGE */}
      <div>
        <CloudinaryImageUploader onUploadImageComplete={handleUploadImageComplete} />

        {uploadedImageUrl && (
          <div className="mt-4">
            <label htmlFor="image">Image Uploaded</label>
            <Input type="hidden" id="image" name="image" value={uploadedImageUrl} />

            <Image
              src={uploadedImageUrl}
              alt="Uploaded Image to Cloudinary"
              className="mt-2 w-64 rounded shadow"
            />
          </div>
        )}
      </div>
      {/* CLOUDINARY FILE */}
      <div>
        <CloudinaryFileUploader onUploadFileComplete={handleUploadFileComplete} />

        {uploadedFileUrl && (
          <div className="mt-4">
            <label htmlFor="file">File Uploaded</label>
            <Input type="hidden" id="file" name="file" value={uploadedFileUrl} />
            <Image
              src={uploadedFileUrl}
              alt="Uploaded File to Cloudinary"
              className="mt-2 w-64 rounded shadow"
            />
          </div>
        )}
      </div>

      {/* LOCAL SAVES --- NOT USED */}

      {/* <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input type="file" id="file" name="file" required={false} />
        {product != null && <div className="text-muted-foreground">{product.filePath}</div>}
        {error.file && <div className="text-destructive">{error.file}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input type="file" id="image" name="image" required={product == null} />
        {product != null && product?.imagePath && (
          <Image src={product.imagePath} height="400" width="400" alt="Product Image" />
        )}
        {error.image && <div className="text-destructive">{error.image}</div>}
      </div> */}
      <SubmitButton />
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save'}
    </Button>
  )
}
