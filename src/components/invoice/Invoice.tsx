'use client'
import React from 'react'
import { jsPDF } from 'jspdf'
import { ShippingInfo, Product } from '../../../types/types'
import Image from 'next/image'
import { formatCurrency, formatDate } from '@/lib/formatters'
import './invoice.css'

interface OrderProps {
  order: {
    id?: string
    orderNumber: string
    newsletter: boolean
    pricePaidInCents: number
    productTotalsPrice: number
    postage: number
    tax: number
    createdAt?: Date
    updatedAt?: Date
    userId: string
    userEmail: string
    shippingInfo: ShippingInfo
    products: Product[]
    paidAt?: Date
    sentAt?: Date
    isCancelled: Boolean
  }
}

const Invoice: React.FC<OrderProps> = ({ order }) => {
  // Helper to Convert ArrayBuffer to Base64
  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = ''
    const bytes = new Uint8Array(buffer)
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary) // Convert to Base64
  }

  const generatePDF = async () => {
    const invoiceElement = document.querySelector('#invoice') as HTMLElement // Explicitly cast to HTMLElement
    if (!invoiceElement) {
      console.error('Invoice element not found')
      return
    }

    const doc = new jsPDF({
      orientation: 'p', // Portrait
      unit: 'mm',
      format: 'a4', // A4 size
    })

    // Fetch and Convert Font to Base64
    try {
      const fontBuffer = await fetch('/fonts/Roboto-Regular.ttf').then((res) => res.arrayBuffer())
      const fontBase64 = arrayBufferToBase64(fontBuffer)

      // Embed Font into jsPDF
      doc.addFileToVFS('Roboto-Regular.ttf', fontBase64)
      doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal')
      doc.setFont('Roboto')
    } catch (error) {
      console.error('Failed to load font', error)
    }

    const scale = 190 / invoiceElement.offsetWidth // Scale based on width

    doc.html(invoiceElement, {
      callback: function (doc) {
        doc.save('invoice.pdf')
      },
      x: 10,
      y: 10,
      width: 190, // A4 width
      windowWidth: invoiceElement.offsetWidth,
      html2canvas: {
        scale: scale, // Scale the content
      },
    })

    // const doc = new jsPDF()
    // doc.html(invoiceElement, {
    //   callback: function (doc) {
    //     doc.save('invoice.pdf')
    //   },
    //   x: 0,
    //   y: 0,
    // })
  }

  const addOneMonth = (date?: Date): Date | undefined => {
    if (!date) return undefined
    const newDate = new Date(date)
    newDate.setMonth(newDate.getMonth() + 1)
    return newDate
  }

  return (
    <div className={`bg-gray-100`}>
      <div id="invoice" className=" bg-white shadow-md rounded-lg p-6 mt-8">
        <div className="flex flex-row justify-between">
          <div>
            <img
              src="/next_ecom_logo.webp"
              alt="next_ecom_logo"
              style={{
                objectFit: 'fill', // Ensures the image fits the container, potentially distorting the aspect ratio
                width: '225px',
                height: '225px',
              }}
            />
          </div>

          <div className="text-right">
            <h1>Pictusweb s.r.o. </h1>
            <h2>Nábrežná 4895/42</h2>
            <h3>940 02 Nové Zámky</h3>
            <h4>Slovenská republika</h4>
            <div className="text-[15px]">
              <h5>IČO: 54631068</h5>
              <h6>DIČ: 2121741424</h6>
              <p>IBAN: SK68 8330 0000 0022 0221 4313</p>
            </div>
            <div className="text-[12px]">
              <p>Firma je zapísaná v obchodnom registri</p>
              <p>okresného súdu Nitra:</p>
              <p> Oddiel: Sro Vložka číslo: 57457/N</p>
              <p>Firma nie je platcom DPH.</p>
            </div>
          </div>
        </div>
        <h1 className="my-4">Faktúra - Daňový doklad </h1>
        <div className="mb-4">
          <p className="text-gray-600">Faktúra: {order.orderNumber}</p>
          <p className="text-gray-600">Dátum: {formatDate(order.createdAt!.toLocaleString())}</p>
        </div>
        <div className="flex flex-row justify-between">
          <div>
            <p>Dátum vystavenia: {formatDate(order.createdAt!.toLocaleString())}</p>
            <p>Dátum splatnosti: {formatDate(addOneMonth(order.createdAt)!.toLocaleString())}</p>
            <p>
              Spôsob platby:{' '}
              {order.shippingInfo.payment_type === 'bank transfer'
                ? 'Bankovým prevodom'
                : order.shippingInfo.payment_type === 'stripe'
                ? 'Kartou Stripe'
                : 'Hotovosť pri prevzatí'}
            </p>
            {order.shippingInfo.payment_type === 'bank transfer' && (
              <p>Variabilný symbol: {order.orderNumber}</p>
            )}
          </div>
          <div className="text-right">
            <h1 className="font-bold">Doručovacie údaje</h1>
            <p>{order.shippingInfo.name}</p>
            <p>
              {order.shippingInfo.street} {order.shippingInfo.house_number}
            </p>
            <p>
              {order.shippingInfo.zip} {order.shippingInfo.city}
            </p>
          </div>
        </div>
        <div className="text-right my-4">
          <h1 className="font-bold">Fakturačné údaje</h1>
          {order.shippingInfo.is_billing_address ? (
            <>
              <p>{order.shippingInfo.billing_name}</p>
              <p>
                {order.shippingInfo.billing_street} {order.shippingInfo.billing_house_number}
              </p>
              <p>
                {order.shippingInfo.billing_zip} {order.shippingInfo.billing_city}
              </p>
              <p>IČO: {order.shippingInfo.billing_ico}</p>
              <p>DIČ: {order.shippingInfo.billing_dic}</p>
              {order.shippingInfo.billing_ico_dph && (
                <p>IČ DPH: {order.shippingInfo.billing_ico_dph}</p>
              )}
            </>
          ) : (
            <>
              <p>{order.shippingInfo.name}</p>
              <p>
                {order.shippingInfo.street} {order.shippingInfo.house_number}
              </p>
              <p>
                {order.shippingInfo.zip} {order.shippingInfo.city}
              </p>
            </>
          )}
        </div>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Produkt</th>
              <th className="border border-gray-300 px-4 py-2">Počet</th>
              <th className="border border-gray-300 px-4 py-2">Cena</th>
              <th className="border border-gray-300 px-4 py-2">Celkom</th>
            </tr>
          </thead>
          {order.products.map((prod) => (
            <tbody key={prod.id}>
              <tr>
                <td className="border border-gray-300 px-4 py-2 text-right">{prod.name}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">{prod.qty}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  {formatCurrency(prod.priceInCents / 100)}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  {' '}
                  {formatCurrency((prod.qty * prod.priceInCents) / 100)}
                </td>
              </tr>
            </tbody>
          ))}
        </table>
        <div className="text-right mt-4">
          <p className="text-lg font-bold">Produkty: {formatCurrency(order.productTotalsPrice)}</p>
          <p className="text-lg font-bold">Poštovné: {formatCurrency(order.postage)}</p>
          {order.tax > 0 && <p className="text-lg font-bold">DPH: {formatCurrency(order.tax)}</p>}

          <p className="text-lg font-bold">Spolu: {formatCurrency(order.pricePaidInCents / 100)}</p>
        </div>
        <div className="flex flex-col justify-center items-center mt-8">
          <p>Vystavil: PV</p>
          <p>Faktúra zároveň slúži ako dodací list</p>
        </div>
      </div>
      <button
        onClick={() => generatePDF()}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Download PDF
      </button>
    </div>
  )
}

export default Invoice
