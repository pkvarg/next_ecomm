import db from '@/db/db'
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'

export async function GET(
  req: NextRequest,
  { params: { downloadVerificationId } }: { params: { downloadVerificationId: string } },
) {
  // const data = await db.downloadVerification.findUnique({
  //   where: { id: downloadVerificationId, expiresAt: { gt: new Date() } },
  //   select: { product: { select: { filePath: true, name: true } } },
  // })
  // if (data == null || data.product.filePath == null) {
  //   return NextResponse.redirect(new URL('/products/download/expired', req.url))
  // }
  // try {
  //   // Ensure filePath is a valid string before passing it to fs.stat and fs.readFile
  //   const filePath = data.product.filePath
  //   const { size } = await fs.stat(filePath)
  //   const file = await fs.readFile(filePath)
  //   const extension = filePath.split('.').pop()
  //   return new NextResponse(file, {
  //     headers: {
  //       'Content-Disposition': `attachment; filename="${data.product.name}.${extension}"`,
  //       'Content-Length': size.toString(),
  //     },
  //   })
  // } catch (error) {
  //   // Handle file read errors, for example, if the file does not exist
  //   return NextResponse.redirect(new URL('/products/download/expired', req.url))
  // }
}
