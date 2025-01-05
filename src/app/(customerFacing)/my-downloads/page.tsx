'use client'
import { getOrdersByUserId } from '@/actions/orders'
import { CardDescription, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/formatters'
import useUserStore from '@/store/userStore'
import { JsonValue } from '@prisma/client/runtime/library'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { FaRegFile } from 'react-icons/fa'

const MyDownloads = () => {
  const [myOrders, setMyOrders] = useState<JsonValue[] | null>([])
  const [ordersWithFiles, setOrdersWithFiles] = useState(false)
  const [filePaths, setFilePaths] = useState<JsonValue[] | null>([])
  const [products, setProducts] = useState<JsonValue[] | null>([])
  const { email, id: userId } = useUserStore()

  useEffect(() => {
    const getMyOrders = async () => {
      const orders = await getOrdersByUserId(userId)
      if (orders) {
        // Serialize orders to ensure it's safely handled
        const serializedOrders: JsonValue[] = orders.map((order) =>
          JSON.parse(JSON.stringify(order)),
        )
        // Set the orders state
        setMyOrders(() => {
          return serializedOrders
        })

        const hasFilePaths = orders
          .flat()
          .flatMap((order) => order.products)
          .some((prod: any) => prod.filePath !== null)

        // Use functional update for state setting
        setOrdersWithFiles(() => {
          return hasFilePaths
        })

        // prods
        const productsWithFiles = orders
          .flat() // Flatten the array of arrays to a single array
          .flatMap(
            (order) => order.products.filter((product: any) => product.filePath !== null), // Filter products with non-empty filePaths
          )
          .reduce((uniqueProducts: any[], product: any) => {
            // Check if the product already exists based on a unique identifier, like 'product.id' or 'product.filePath'
            if (!uniqueProducts.some((uniqueProduct) => uniqueProduct.id === product.id)) {
              uniqueProducts.push(product) // Add to the array if it's unique
            }
            return uniqueProducts
          }, []) // Start with an empty array
        // Use functional update for state setting
        setProducts(() => {
          return productsWithFiles
        })
        const filePaths = Array.from(
          new Set(
            orders
              .flat() // Flatten the array of arrays to a single array
              .flatMap(
                (order) =>
                  order.products
                    .filter((product: any) => product.filePath !== null) // Filter products with non-null filePaths
                    .map((product: any) => product.filePath), // Extract the filePaths
              ),
          ),
        )
        // Set the filePaths state
        setFilePaths(() => {
          return filePaths
        })
      }
    }
    getMyOrders()
  }, [email, userId])

  // Early return when no orders are present
  if (myOrders?.length === 0) {
    return <h1>You have no Orders</h1>
  }

  if (!ordersWithFiles) {
    return <h1>You have no Orders with Downlodable Products</h1>
  }

  const getFileNameFromUrl = (url: string) => {
    const parts = url.split('/')
    return parts[parts.length - 1] // The last part of the URL is the file name
  }

  const handleDownload = async (url: string) => {
    try {
      const fileName = getFileNameFromUrl(url) // Get the file name from the URL

      // Fetch the image file from the URL
      const response = await fetch(url)
      const blob = await response.blob() // Convert the image to a Blob

      // Create a temporary link element
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob) // Create an object URL for the Blob
      link.download = fileName // Set the desired filename
      link.click() // Programmatically trigger the download
    } catch (error) {
      console.error('Error downloading the file:', error)
    }
  }

  return (
    <div className="mx-4 lg:mx-[10%]">
      <h2>My Invoices ...</h2>

      {products?.map((prod: any) => (
        <div key={prod.id} className="flex overflow-hidden flex-row my-8">
          <div className="relative m-2">
            <Image
              src={prod.imagePath || '/products/dummy_prod.webp'}
              width={75}
              height={75}
              alt={prod.name}
              priority
              className="w-auto h-auto"
            />
          </div>

          <div className="flex flex-col mt-2">
            <div className="flex flex-row justify-between gap-4">
              <CardTitle>{prod.name}</CardTitle>
              {prod.filePath && <FaRegFile className="text-[25px]" />}
            </div>

            <CardDescription>
              <span className="line-clamp-4 mt-2 text-justify max-w-[90%]">{prod.description}</span>

              {formatCurrency(prod.priceInCents / 100)}
            </CardDescription>

            <button
              onClick={() => handleDownload(prod.filePath)}
              className="bg-blue-500 text-white p-2 rounded w-fit my-8"
            >
              Download File
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MyDownloads
