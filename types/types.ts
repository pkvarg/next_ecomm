interface Product {
  id: string
  name: string
  priceInCents: number
  filePath: string
  imagePath: string
  description: string
  isAvailableForPurchase: boolean
  createdAt: Date
  updatedAt: Date
  qty: number
  downloadVerifications: []
  countInStock: number
}

interface ShippingInfo {
  name: string
  street: string
  houseNumber: string
  city: string
  zip: string
  country: string
  phone: string
  note: string
  is_billing_address: boolean
  billing_name: string
  billing_address: string
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
}

interface Order {
  id: string
  pricePaidInCents: number
  createdAt: Date
  updatedAt: Date
  userId: string
  userInfo: ShippingInfo
  products: Product[]
}
