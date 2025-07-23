import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const categories = [
  {
    id: "electronics",
    title: "Electronics",
    description: "Gadgets and devices for everyday use",
    image: "/placeholder.svg?height=400&width=600",
    count: 156,
  },
  {
    id: "fashion",
    title: "Fashion",
    description: "Clothes, shoes, and accessories",
    image: "/placeholder.svg?height=400&width=600",
    count: 234,
  },
  {
    id: "home-garden",
    title: "Home & Garden",
    description: "Furniture and home decor",
    image: "/placeholder.svg?height=400&width=600",
    count: 89,
  },
  {
    id: "sports",
    title: "Sports",
    description: "Equipment and gear for active lifestyle",
    image: "/placeholder.svg?height=400&width=600",
    count: 67,
  },
  {
    id: "books",
    title: "Books",
    description: "Literature and educational materials",
    image: "/placeholder.svg?height=400&width=600",
    count: 123,
  },
  {
    id: "beauty",
    title: "Beauty & Health",
    description: "Skincare, makeup, and personal care",
    image: "/placeholder.svg?height=400&width=600",
    count: 78,
  },
]

export default function CategoryGrid() {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.id}`}
            className="group relative overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md"
          >
            <div className="aspect-square relative overflow-hidden">
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.title || "Category"}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="text-xl font-bold mb-1">{category.title}</h3>
              <p className="text-sm text-white/80 mb-2">{category.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm">{category.count} products</span>
                <span className="flex items-center text-sm font-medium">
                  Shop now
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
