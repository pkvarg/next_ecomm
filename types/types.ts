export interface Product {
  id: string
  name: string
  priceInCents: number
  filePath?: string
  imagePath: string
  description?: string
  isAvailableForPurchase?: boolean
  createdAt: Date
  updatedAt: Date
  qty: number
  downloadVerifications?: []
  countInStock: number
}

export interface ShippingInfo {
  name: string
  street: string
  house_number: string
  city: string
  zip: string
  country: string
  phone: string
  note: string
  is_billing_address: boolean
  billing_name: string
  billing_street: string
  billing_house_number: string
  billing_city: string
  billing_zip: string
  billing_country: string
  billing_ico: string
  billing_dic: string
  billing_ico_dph: string
  is_ico_dic: boolean
  payment_type: string
  cash: boolean
  stripe: boolean
  bank: boolean
}

export interface Order {
  id?: string
  orderNumber: string
  newsletter: boolean
  pricePaidInCents: number
  productTotalsPrice: number
  postage: number
  tax: number
  createdAt?: Date
  updatedAt?: Date
  userEmail: string
  userInfo: ShippingInfo
  products: Product[]
}
