"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

const heroSlides = [
  {
    id: 1,
    title: "Summer Collection 2025",
    subtitle: "Discover the latest trends and styles",
    description: "Shop our exclusive summer collection with up to 40% off on selected items.",
    image: "/placeholder.svg?height=600&width=1200",
    buttonText: "Shop Now",
    buttonLink: "/products?category=summer",
  },
  {
    id: 2,
    title: "Premium Electronics",
    subtitle: "Cutting-edge technology at your fingertips",
    description: "Explore our range of high-quality electronics with free shipping on all orders.",
    image: "/placeholder.svg?height=600&width=1200",
    buttonText: "Discover More",
    buttonLink: "/products?category=electronics",
  },
  {
    id: 3,
    title: "Home & Living",
    subtitle: "Transform your living space",
    description: "Find everything you need to make your house a home with our curated collection.",
    image: "/placeholder.svg?height=600&width=1200",
    buttonText: "Explore Collection",
    buttonLink: "/products?category=home",
  },
]

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
      {heroSlides.map((slide, index) => (
        <motion.div
          key={slide.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: index === currentSlide ? 1 : 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          <Image
            src={slide.image || "/placeholder.svg"}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="max-w-3xl mx-auto text-white"
            >
              <h2 className="text-sm md:text-lg font-medium mb-2">{slide.subtitle}</h2>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">{slide.title}</h1>
              <p className="text-sm md:text-lg mb-6 max-w-xl mx-auto">{slide.description}</p>
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href={slide.buttonLink}>
                  {slide.buttonText}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      ))}

      <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center space-x-2">
        {heroSlides.map((slide, index) => (
          <button
            key={`slide-${slide.id}`}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-white scale-125" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
