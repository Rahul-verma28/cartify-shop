import connectDB from "@/lib/mongoDB"
import Product from "@/lib/models/Product"
import ProductCard from "@/components/ProductCard"

interface RelatedProductsProps {
  category: string
  currentProductId: string
}

async function getRelatedProducts(category: string, currentProductId: string) {
  await connectDB()
  const products = await Product?.find({
    category,
    _id: { $ne: currentProductId },
  })
    .limit(4)
    .lean()

  return JSON.parse(JSON.stringify(products))
}

export default async function RelatedProducts({ category, currentProductId }: RelatedProductsProps) {
  const products = await getRelatedProducts(category, currentProductId)

  if (products?.length === 0) {
    return null
  }

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products?.map((product: any) => (
          <ProductCard key={product?._id} product={product} />
        ))}
      </div>
    </section>
  )
}
