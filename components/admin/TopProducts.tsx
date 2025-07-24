"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TopProduct {
  _id: string;
  title: string;
  image: string;
  sales: number;
  revenue: number;
}

export default function TopProducts() {
  const [products, setProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopProducts();
  }, []);

  const fetchTopProducts = async () => {
    try {
      const response = await fetch("/api/admin/top-products");
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching top products:", error);
      // Mock data for demo
      setProducts([
        {
          _id: "1",
          title: "Wireless Headphones",
          image: "/placeholder.svg?height=50&width=50",
          sales: 234,
          revenue: 23400,
        },
        {
          _id: "2",
          title: "Smart Watch",
          image: "/placeholder.svg?height=50&width=50",
          sales: 189,
          revenue: 18900,
        },
        {
          _id: "3",
          title: "Laptop Stand",
          image: "/placeholder.svg?height=50&width=50",
          sales: 156,
          revenue: 15600,
        },
        {
          _id: "4",
          title: "Ergonomic Mouse",
          image: "/placeholder.svg?height=50&width=50",
          sales: 121,
          revenue: 7260,
        },
        {
          _id: "5",
          title: "Mechanical Keyboard",
          image: "/placeholder.svg?height=50&width=50",
          sales: 98,
          revenue: 11760,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-1/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
        <CardDescription>
          Your best-selling products this month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products?.map((product, index) => (
            <motion.div
              key={product?._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center space-x-4"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={product?.image} alt={product?.title} />
                <AvatarFallback>{product?.title.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="text-sm font-medium">{product?.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {product?.sales} sales • ${product?.revenue.toLocaleString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
