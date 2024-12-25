import db from '@/db/db'
import { notFound } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'

export async function GET(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  // Fetch the product from the database
  const product = await db.product.findUnique({
    where: { id },
    select: { filePath: true, name: true },
  })

  // If the product doesn't exist or the filePath is null, return a not found response
  if (product == null || product.filePath == null) {
    return notFound()
  }

  try {
    const filePath = product.filePath // Ensure filePath is a string

    // Get file stats (size)
    const { size } = await fs.stat(filePath)

    // Read the file content
    const file = await fs.readFile(filePath)

    // Get the file extension
    const extension = filePath.split('.').pop()

    // Return the file as a download
    return new NextResponse(file, {
      headers: {
        'Content-Disposition': `attachment; filename="${product.name}.${extension}"`,
        'Content-Length': size.toString(),
      },
    })
  } catch (error) {
    // If there is an error (e.g., file not found), return the expired page
    return NextResponse.redirect(new URL('/products/download/expired', req.url))
  }
}
