"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-pink-500/10 rounded-full blur-xl animate-pulse delay-2000" />

      <div className="relative pt-20 pb-16 sm:pt-28 sm:pb-24 lg:pt-10 lg:pb-32">
        <div className="mx-auto container px-4 sm:px-6 lg:px-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20"
          >
            {/* Content Section */}
            <div className="relative z-10 lg:col-span-7 lg:max-w-none lg:pt-20">
              <motion.div variants={itemVariants}>
                <Badge variant="secondary" className="mb-4 px-3 py-1">
                  <Sparkles className="w-3 h-3 mr-1" />
                  New Collection 2024
                </Badge>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl xl:text-7xl"
              >
                <span className="block">Discover Your</span>
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  Perfect Style
                </span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="mt-6 text-md text-gray-600 dark:text-gray-300 sm:text-lg lg:text-xl max-w-2xl"
              >
                Experience premium fashion with our Cartify recommendations.
                Curated collections that match your unique style and personality.
              </motion.p>

              {/* Stats */}
              <motion.div
                variants={itemVariants}
                className="mt-8 flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-400"
              >
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="font-semibold">4.9</span>
                  <span className="ml-1">Customer Rating</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 text-blue-500 mr-1" />
                  <span className="font-semibold">10K+</span>
                  <span className="ml-1">Happy Customers</span>
                </div>
                <div className="flex items-center">
                  <Sparkles className="w-4 h-4 text-purple-500 mr-1" />
                  <span className="font-semibold">500+</span>
                  <span className="ml-1">Premium Brands</span>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                variants={itemVariants}
                className="mt-10 flex flex-col sm:flex-row gap-4"
              >
                <Button size="lg" className="group" asChild>
                  <Link href="#collections">
                    Shop Collection
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="#categories">Browse Categories</Link>
                </Button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                variants={itemVariants}
                className="mt-12 flex flex-wrap items-center gap-8 opacity-60"
              >
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  TRUSTED BY
                </span>
                <div className="flex items-center gap-6">
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded opacity-50" />
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded opacity-50" />
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded opacity-50" />
                </div>
              </motion.div>
            </div>

            {/* Image Section */}
            <div className="relative mt-16 lg:col-span-5 lg:mt-0">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative"
              >
                {/* Main Image Grid */}
                <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                  <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                    <motion.div
                      variants={imageVariants}
                      className="aspect-[3/4] overflow-hidden rounded-2xl shadow-xl"
                    >
                      <Image
                        src="/HeroSection/01.jpg"
                        alt="Fashion model 1"
                        width={200}
                        height={300}
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </motion.div>
                    <motion.div
                      variants={imageVariants}
                      className="aspect-[3/4] overflow-hidden rounded-2xl shadow-xl"
                    >
                      <Image
                        src="/HeroSection/02.jpg"
                        alt="Fashion model 2"
                        width={200}
                        height={300}
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </motion.div>
                  </div>
                  <div className="space-y-4 sm:space-y-6 lg:space-y-8 pt-8 sm:pt-12 lg:pt-16">
                    <motion.div
                      variants={imageVariants}
                      className="aspect-[3/4] overflow-hidden rounded-2xl shadow-xl"
                    >
                      <Image
                        src="/HeroSection/03.jpg"
                        alt="Fashion model 3"
                        width={200}
                        height={300}
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </motion.div>
                    <motion.div
                      variants={imageVariants}
                      className="aspect-[3/4] overflow-hidden rounded-2xl shadow-xl"
                    >
                      <Image
                        src="/HeroSection/04.jpg"
                        alt="Fashion model 4"
                        width={200}
                        height={300}
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </motion.div>
                  </div>
                </div>

              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-12 sm:h-16 lg:h-20 text-white dark:text-gray-900"
          preserveAspectRatio="none"
          viewBox="0 0 1440 120"
          fill="currentColor"
        >
          <path d="M0,0 C60,40 180,80 360,80 C540,80 660,40 840,40 C1020,40 1140,80 1320,80 C1380,80 1410,60 1440,40 L1440,120 L0,120 Z" />
        </svg>
      </div>
    </div>
  );
}
