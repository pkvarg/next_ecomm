'use client'
import React from 'react'
import { jsPDF } from 'jspdf'
import { ShippingInfo, Product } from '../../types/types'
import Image from 'next/image'
import { formatCurrency } from '@/lib/formatters'

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
  const generatePDF = () => {
    const invoiceElement = document.querySelector('#invoice') as HTMLElement // Explicitly cast to HTMLElement
    if (!invoiceElement) {
      console.error('Invoice element not found')
      return
    }

    const doc = new jsPDF()
    doc.html(invoiceElement, {
      callback: function (doc) {
        doc.save('invoice.pdf')
      },
      x: 5,
      y: 5,
    })
  }

  const addOneMonth = (date?: Date): Date | undefined => {
    if (!date) return undefined
    const newDate = new Date(date)
    newDate.setMonth(newDate.getMonth() + 1)
    return newDate
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div id="invoice" className=" bg-white shadow-md rounded-lg p-6 mt-8">
        <div className="flex flex-row justify-between">
          <div>
            <Image
              src={'/next_ecom_logo.webp'}
              alt="next_ecom_logo"
              width={100}
              height={100}
              className="w-auto h-auto"
            />
          </div>

          <div className="text-right">
            <h1 className="font-bold">Pictusweb s.r.o. </h1>
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
        <h1 className="text-2xl font-bold my-4">Faktúra - Daňový doklad </h1>
        <div className="mb-4">
          <p className="text-gray-600">Faktúra: {order.orderNumber}</p>
          <p className="text-gray-600">Dátum: {order.createdAt?.toDateString()}</p>
        </div>
        <div className="flex flex-row justify-between">
          <div>
            <p>Dátum vystavenia: {order.createdAt?.toDateString()}</p>
            <p>Dátum splatnosti: {addOneMonth(order.createdAt)?.toDateString()}</p>
            <p>Spôsob platby: {order.shippingInfo.payment_type}</p>
            {order.shippingInfo.payment_type === 'bank transfer' && (
              <p>Variabilný symbol: {order.orderNumber}</p>
            )}
          </div>
          <div className="text-right">
            <p className="font-bold">Doručovacie údaje</p>
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
          <p className="font-bold">Fakturačné údaje</p>
          {order.shippingInfo.is_billing_address ? (
            <>
              <p>{order.shippingInfo.billing_name}</p>
              <p>
                {order.shippingInfo.billing_street} {order.shippingInfo.billing_house_number}
              </p>
              <p>
                {order.shippingInfo.billing_zip} {order.shippingInfo.billing_city}
              </p>
              <p> {order.shippingInfo.billing_ico}</p>
              <p> {order.shippingInfo.billing_dic}</p>
              <p> {order.shippingInfo.billing_ico_dph}</p>
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
        <div className="flex flex-col justify-center items-center mt-4">
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
