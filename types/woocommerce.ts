export interface Product {
  id: number
  name: string
  slug: string
  permalink: string
  date_created: string
  date_modified: string
  type: string
  status: string
  featured: boolean
  catalog_visibility: string
  description: string
  short_description: string
  sku: string
  price: string
  regular_price: string
  sale_price: string
  on_sale: boolean
  purchasable: boolean
  total_sales: number
  virtual: boolean
  downloadable: boolean
  downloads: any[]
  download_limit: number
  download_expiry: number
  external_url: string
  button_text: string
  tax_status: string
  tax_class: string
  manage_stock: boolean
  stock_quantity: number | null
  backorders: string
  backorders_allowed: boolean
  backordered: boolean
  low_stock_amount: number | null
  sold_individually: boolean
  weight: string
  dimensions: {
    length: string
    width: string
    height: string
  }
  shipping_required: boolean
  shipping_taxable: boolean
  shipping_class: string
  shipping_class_id: number
  reviews_allowed: boolean
  average_rating: string
  rating_count: number
  upsell_ids: number[]
  cross_sell_ids: number[]
  parent_id: number
  purchase_note: string
  categories: Category[]
  tags: Tag[]
  images: ProductImage[]
  attributes: ProductAttribute[]
  default_attributes: any[]
  variations: number[]
  grouped_products: number[]
  menu_order: number
  price_html: string
  related_ids: number[]
  meta_data: any[]
  stock_status: string
}

export interface Category {
  id: number
  name: string
  slug: string
  parent: number
  description: string
  display: string
  image: CategoryImage | null
  menu_order: number
  count: number
}

export interface Tag {
  id: number
  name: string
  slug: string
}

export interface ProductImage {
  id: number
  date_created: string
  date_modified: string
  src: string
  name: string
  alt: string
}

export interface CategoryImage {
  id: number
  date_created: string
  date_modified: string
  src: string
  name: string
  alt: string
}

export interface ProductAttribute {
  id: number
  name: string
  position: number
  visible: boolean
  variation: boolean
  options: string[]
}

export interface CartItem {
  key: string
  id: number
  quantity: number
  name: string
  price: number
  line_total: string
  line_subtotal: string
  product: Product
}

export interface Customer {
  id: number
  date_created: string
  date_modified: string
  email: string
  first_name: string
  last_name: string
  role: string
  username: string
  billing: Address
  shipping: Address
  is_paying_customer: boolean
  avatar_url: string
  meta_data: any[]
}

export interface Address {
  first_name: string
  last_name: string
  company: string
  address_1: string
  address_2: string
  city: string
  state: string
  postcode: string
  country: string
  email?: string
  phone?: string
}

export interface Order {
  id: number
  parent_id: number
  status: string
  currency: string
  version: string
  prices_include_tax: boolean
  date_created: string
  date_modified: string
  discount_total: string
  discount_tax: string
  shipping_total: string
  shipping_tax: string
  cart_tax: string
  total: string
  total_tax: string
  customer_id: number
  order_key: string
  billing: Address
  shipping: Address
  payment_method: string
  payment_method_title: string
  transaction_id: string
  customer_ip_address: string
  customer_user_agent: string
  created_via: string
  customer_note: string
  date_completed: string | null
  date_paid: string | null
  cart_hash: string
  number: string
  meta_data: any[]
  line_items: OrderLineItem[]
  tax_lines: any[]
  shipping_lines: any[]
  fee_lines: any[]
  coupon_lines: any[]
  refunds: any[]
  payment_url: string
  is_editable: boolean
  needs_payment: boolean
  needs_processing: boolean
  date_created_gmt: string
  date_modified_gmt: string
  date_completed_gmt: string | null
  date_paid_gmt: string | null
  currency_symbol: string
}

export interface OrderLineItem {
  id: number
  name: string
  product_id: number
  variation_id: number
  quantity: number
  tax_class: string
  subtotal: string
  subtotal_tax: string
  total: string
  total_tax: string
  taxes: any[]
  meta_data: any[]
  sku: string
  price: number
  image: ProductImage
  parent_name: string | null
}