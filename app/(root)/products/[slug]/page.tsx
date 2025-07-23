import { notFound } from "next/navigation"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import CartDrawer from "@/components/cart/CartDrawer"
import ProductDetails from "@/components/products/ProductDetails"
import RelatedProducts from "@/components/products/RelatedProducts"
import connectDB from "@/lib/db"
import Product from "@/schemas/Product"

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getProduct(slug: string) {
  await connectDB()
  const product = await Product?.findOne({ slug }).lean()
  return product ? JSON.parse(JSON.stringify(product)) : null
}

export async function generateMetadata({ params }: ProductPageProps) {
  const resolvedParams = await params
  const product = await getProduct(resolvedParams.slug)

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  return {
    title: `${product?.title} - ModernShop`,
    description: product?.description,
    openGraph: {
      title: product?.title,
      description: product?.description,
      images: product?.images,
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params
  const product = await getProduct(resolvedParams.slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main>
        <ProductDetails product={product} />
        <RelatedProducts category={product?.category} currentProductId={product?._id} />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}
