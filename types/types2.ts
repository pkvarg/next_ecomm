// Define the structure for a single product
export interface Product {
  id: string
  qty: number
  name: string
  filePath: string
  createdAt: string
  imagePath: string
  updatedAt: string
  description: string
  priceInCents: number
  isAvailableForPurchase: boolean
}

// Define the structure for the userInfo field
export interface UserInfo {
  zip: string
  cash: boolean
  city: string
  name: string
  note: string
  phone: string
  street: string
  stripe: boolean
  country: string
  is_ico_dic: boolean
  billing_dic: string
  billing_ico: string
  billing_zip: string
  billing_city: string
  billing_name: string
  house_number: string
  payment_type: string
  billing_street: string
  billing_country: string
  billing_ico_dph: string
  is_billing_address: boolean
  billing_house_number: string
}

// Define the structure for the order
export interface Order {
  id: string
  pricePaidInCents: string // assuming this is a string based on the example
  createdAt: string // ISO string format
  updatedAt: string // ISO string format
  userId: string
  userInfo: UserInfo
  products: Product[]
}
