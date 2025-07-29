"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Award } from "lucide-react";

interface Brand {
  id: string;
  name: string;
  logo: string;
  alt: string;
}

const brands: Brand[] = [
  {
    id: "1",
    name: "Brand 1",
    logo: "/Brands/brand-01.jpg",
    alt: "Brand 1 Logo",
  },
  {
    id: "2",
    name: "Brand 2",
    logo: "/Brands/brand-02.jpg",
    alt: "Brand 2 Logo",
  },
  {
    id: "3",
    name: "Brand 3",
    logo: "/Brands/brand-03.jpg",
    alt: "Brand 3 Logo",
  },
  {
    id: "4",
    name: "Brand 4",
    logo: "/Brands/brand-04.jpg",
    alt: "Brand 4 Logo",
  },
  {
    id: "5",
    name: "Brand 5",
    logo: "/Brands/brand-05.jpg",
    alt: "Brand 5 Logo",
  },
  {
    id: "6",
    name: "Brand 6",
    logo: "/Brands/brand-06.jpg",
    alt: "Brand 6 Logo",
  },
  {
    id: "7",
    name: "Brand 7",
    logo: "/Brands/brand-07.jpg",
    alt: "Brand 7 Logo",
  },
  {
    id: "8",
    name: "Brand 8",
    logo: "/Brands/brand-08.jpg",
    alt: "Brand 8 Logo",
  },
  {
    id: "9",
    name: "Brand 9",
    logo: "/Brands/brand-09.jpg",
    alt: "Brand 9 Logo",
  },
  {
    id: "10",
    name: "Brand 10",
    logo: "/Brands/brand-10.jpg",
    alt: "Brand 10 Logo",
  },
  {
    id: "11",
    name: "Brand 11",
    logo: "/Brands/brand-11.jpg",
    alt: "Brand 11 Logo",
  },
  {
    id: "12",
    name: "Brand 12",
    logo: "/Brands/brand-12.jpg",
    alt: "Brand 12 Logo",
  },
  {
    id: "13",
    name: "Brand 13",
    logo: "/Brands/brand-13.jpg",
    alt: "Brand 13 Logo",
  },
];

function BrandSkeleton() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Skeleton className="h-9 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-16 w-full" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function BrandShowcase() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <BrandSkeleton />;
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200 dark:border-blue-700 mb-6">
            <Award className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
              Trusted Partners
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-gray-100 dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent mb-4">
            Trusted by Leading Brands
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            We partner with the world's most innovative companies to bring you
            the best products and experiences
          </p>
        </motion.div>

        {/* Alternative: Infinite scroll animation */}
        <div className="overflow-hidden">
          <div className="flex animate-scroll space-x-2">
            {[...brands, ...brands].map((brand, index) => (
              <div
                key={`${brand.id}-${index}`}
                className="flex-shrink-0 w-40 h-20 lg:w-60 lg:h-32 flex items-center justify-center"
              >
                <Image
                  src={brand.logo}
                  alt={brand.alt}
                  width={200}
                  height={120}
                  className="max-h-full max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300 hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
