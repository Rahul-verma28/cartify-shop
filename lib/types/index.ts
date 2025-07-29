export interface User {
  _id: string
  name: string
  email: string
  image?: string
  role: "user" | "admin"
  createdAt: Date
  updatedAt: Date
}

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  image?: string;
};

export interface Product {
  _id: string
  title: string
  slug: string
  description: string
  price: number
  comparePrice?: number
  images: string[]
  category: string
  tags: string[]
  rating: {
    average: number
    count: number
  }
  size?: string[]
  color?: string[]
  collections?: string[]
  inventory: number
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  _id: string
  title: string
  slug: string
  description?: string
  image?: string
  createdAt: Date
  updatedAt: Date
}

export interface Collection {
  _id: string
  title: string
  slug?: string
  description?: string
  image: string
  products?: Product[]
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  _id: string
  user: string
  items: {
    product: string
    quantity: number
    price: number
  }[]
  total: number
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled"
  shippingAddress: Address
  paymentMethod: string
  stripeSessionId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Address {
  fullName: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface Review {
  _id: string
  user: User
  product: string
  rating: number
  comment: string
  createdAt: Date
}

export interface WishlistItem {
  productId: string
  addedAt: Date
}

export interface FilterState {
  category: string
  collection: string
  priceRange: [number, number]
  rating: number
  tags: string[]
  size: string[]
  color: string[]
  featured: boolean
  search: string
  sortBy: "createdAt" | "price" | "title" | "rating.average"
  order: "asc" | "desc"
}

export interface AIMessage {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}
