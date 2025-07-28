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
import { useAppDispatch, useAppSelector } from "@/lib/hooks/use-redux";
import { useEffect } from "react";
import { fetchCollections } from "@/lib/redux/slices/filtersSlice";

interface CollectionType {
  _id: string;
  title: string;
  image: string;
  description?: string;
}

const Collections = async () => {
  const dispatch = useAppDispatch();

  const { collections } = useAppSelector((state) => state.filters);
console.log("Collections:", collections);
//   useEffect(() => {
//     dispatch(fetchCollections());
//   }, []);

  try {
    // const collections = await getCollections();

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
      <section className="flex flex-col p-6 md:p-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-2">
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
            className="w-full max-w-7xl mx-auto"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {collections?.map((collection: CollectionType) => (
                <CarouselItem
                  key={collection._id}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <Link
                    href={`/collections/${collection._id}`}
                    className="group block"
                  >
                    <div className="relative overflow-hidden rounded-xl shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                      <Image
                        src={collection.image}
                        alt={collection.title}
                        width={400}
                        height={300}
                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                        priority={false}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                        <h3 className="text-white font-semibold text-lg truncate">
                          {collection.title}
                        </h3>
                        {collection.description && (
                          <p className="text-white/80 text-sm mt-1 line-clamp-2">
                            {collection.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error fetching collections:", error);
    return (
      <div className="flex flex-col items-center justify-center p-10">
        <p className="text-2xl font-semibold mb-4">Collections</p>
        <p className="text-red-500">
          Failed to load collections. Please try again later.
        </p>
      </div>
    );
  }
};

export default Collections;
