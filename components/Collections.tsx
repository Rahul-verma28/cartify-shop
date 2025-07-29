"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface CollectionType {
  slug: any;
  _id: string;
  title: string;
  image: string;
  description?: string;
}

const Collections = () => {
  const [collections, setCollections] = useState<CollectionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await fetch("/api/collections?simple=true");
      if (!response.ok) throw new Error("Failed to fetch collections");
      const data = await response.json();

      // Ensure data is always an array
      if (Array.isArray(data)) {
        setCollections(data);
      } else if (data.collections && Array.isArray(data.collections)) {
        setCollections(data.collections);
      } else {
        setCollections([]);
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
      setError(true);
      setCollections([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="flex flex-col p-6 md:p-10">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mx-auto mb-2" />
          <Skeleton className="h-5 w-48 mx-auto" />
        </div>
        <div className="relative">
          <div className="flex gap-4 overflow-hidden max-w-7xl mx-auto">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="min-w-[300px] overflow-hidden">
                <Skeleton className="h-64 w-full" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-10">
        <p className="text-2xl font-semibold mb-4">Collections</p>
        <p className="text-red-500">
          Failed to load collections. Please try again later.
        </p>  
      </div>
    );
  }

  if (!collections || collections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10">
        <p className="text-2xl font-semibold mb-4">Collections</p>
        <p className="text-gray-500">
          No collections available at the moment.
        </p>
      </div>
    );
  }

  return (
    <section className="flex flex-col p-6 md:p-10 bg-white dark:bg-gray-900">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-center">
          Our Collections
        </h2>
        <p className="text-gray-600 text-center">
          Discover our curated collections
        </p>
      </div>

      <div className="relative">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full container mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4 px-1">
            {Array.isArray(collections) && collections.map((collection: CollectionType) => (
              <CarouselItem
                key={collection._id}
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 pb-8"
              >
                <Link
                  href={`/collection/${collection?.slug}`}
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-xl shadow-md transition-all duration-300 group-hover:shadow-xl">
                    <Image
                      src={collection.image?.trim() || "/placeholder.svg"}
                      alt={collection.title}
                      width={400}
                      height={300}
                      className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                      priority={false}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                    <div className="hidden group-hover:block absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                      <h3 className="text-white font-semibold text-sm truncate">
                        {collection.title}
                      </h3>
                      {collection.description && (
                        <p className="text-white/80 text-xs mt-1 line-clamp-1">
                          {collection.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-3" />
          <CarouselNext className="-right-3" />
        </Carousel>
      </div>
    </section>
  );
};

export default Collections;
