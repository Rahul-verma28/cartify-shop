"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Users,
  Settings,
  BarChart3,
  Package,
  Heart,
  Search,
  Shield,
  Smartphone,
  Palette,
  Database,
  Globe,
  Mail,
  Github,
  Linkedin,
  Star,
  CheckCircle,
  DollarSign,
  Zap,
  Code,
  Crown,
  Rocket,
} from "lucide-react";

const features = [
  {
    category: "Customer Features",
    icon: ShoppingCart,
    items: [
      "User Authentication & Registration",
      "Product Browsing & Search",
      "Advanced Product Filtering",
      "Shopping Cart Management",
      "Wishlist Functionality",
      "Order History & Tracking",
      "User Profile Management",
      "Responsive Mobile Design",
      "Dark/Light Theme Toggle",
      "Product Reviews & Ratings",
    ],
  },
  {
    category: "Admin Dashboard",
    icon: Settings,
    items: [
      "Complete Product Management",
      "Category & Collection Management",
      "Order Management System",
      "User Management",
      "Analytics & Reports",
      "Inventory Management",
      "Content Management",
      "Settings Configuration",
      "Real-time Notifications",
      "Data Export Capabilities",
    ],
  },
  {
    category: "Technical Features",
    icon: Code,
    items: [
      "Next.js 14 with App Router",
      "TypeScript for Type Safety",
      "Redux Toolkit State Management",
      "MongoDB Database",
      "NextAuth.js Authentication",
      "Tailwind CSS Styling",
      "Framer Motion Animations",
      "Server-Side Rendering",
      "API Routes & Middleware",
      "Error Handling & Fallbacks",
    ],
  },
];

const techStack = [
  {
    name: "Next.js 14",
    icon: "⚡",
    description: "React framework with App Router",
  },
  { name: "TypeScript", icon: "🔷", description: "Type-safe development" },
  { name: "Redux Toolkit", icon: "🔄", description: "State management" },
  { name: "MongoDB", icon: "🍃", description: "NoSQL database" },
  { name: "NextAuth.js", icon: "🔐", description: "Authentication solution" },
  { name: "Tailwind CSS", icon: "🎨", description: "Utility-first CSS" },
  { name: "Framer Motion", icon: "🎭", description: "Animation library" },
  { name: "Shadcn/ui", icon: "🧩", description: "UI components" },
];

const stats = [
  { number: "50+", label: "Components", icon: Package },
  { number: "10+", label: "Pages", icon: Globe },
  { number: "100%", label: "Responsive", icon: Smartphone },
  { number: "A+", label: "Performance", icon: Zap },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4 bg-blue-600 text-white hover:bg-blue-700">
              <Crown className="w-4 h-4 mr-2" />
              Premium E-commerce Solution
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              CartifyShop
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              A complete, modern e-commerce platform built with cutting-edge
              technologies. Features a powerful admin dashboard, seamless user
              experience, and enterprise-grade functionality.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Rocket className="w-5 h-5 mr-2" />
                  View Live Demo
                </Button>
              </Link>
              <Link href="https://github.com/Rahul-verma28">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <Github className="w-5 h-5 mr-2" />
                  Source Code
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="pt-6">
                    <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Comprehensive Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need for a successful e-commerce business, from
              customer-facing features to powerful admin tools.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.category}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-600 rounded-lg">
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-xl">
                        {feature.category}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {feature.items.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="flex items-start space-x-3"
                        >
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 bg-blue-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Built with Modern Technologies
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Leveraging the latest and most reliable technologies for optimal
              performance and scalability.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardContent className="pt-6">
                    <div className="text-3xl mb-3">{tech.icon}</div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {tech.name}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {tech.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl">
              <CardContent className="p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                  <div className="text-center md:text-left">
                    <div className="flex justify-center">
                      <div className="w-32 h-32 mx-auto md:mx-0 mb-4 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-4xl font-bold text-white">R</span>
                      </div>
                    </div>
                    <div className="flex justify-center md:justify-start space-x-4">
                      <Link target="_blank" href="https://github.com/Rahul-verma28">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <Github className="w-4 h-4 mr-2" />
                          GitHub
                        </Button>
                      </Link>
                      <Link target="_blank" href="https://www.linkedin.com/in/rahul-verma-09227a263">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <Linkedin className="w-4 h-4 mr-2" />
                          LinkedIn
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                      About the Developer
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                      Hi! I'm <strong>Rahul</strong>, a passionate full-stack
                      developer with expertise in modern web technologies. I
                      specialize in creating scalable, user-friendly
                      applications using React, Next.js, and Node.js.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      This e-commerce platform represents my commitment to
                      building high-quality, production-ready applications with
                      clean code, modern architecture, and exceptional user
                      experience.
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {[
                        "React",
                        "Next.js",
                        "TypeScript",
                        "Node.js",
                        "MongoDB",
                        "AWS",
                      ].map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <Link href="/contact">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Mail className="w-4 h-4 mr-2" />
                        Get in Touch
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Purchase Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <div className="max-w-3xl mx-auto">
              <DollarSign className="w-16 h-16 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Interested in Purchasing This Platform?
              </h2>
              <p className="text-xl mb-8 leading-relaxed opacity-90">
                Get the complete source code, documentation, and deployment
                guide. Perfect for starting your own e-commerce business or
                learning modern web development.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-700 rounded-lg p-6">
                  <Code className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Complete Source Code</h3>
                  <p className="text-sm opacity-80">
                    Full access to all components, pages, and functionality
                  </p>
                </div>
                <div className="bg-blue-700 rounded-lg p-6">
                  <Shield className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Documentation</h3>
                  <p className="text-sm opacity-80">
                    Comprehensive setup and customization guide
                  </p>
                </div>
                <div className="bg-blue-700 rounded-lg p-6">
                  <Zap className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Lifetime Updates</h3>
                  <p className="text-sm opacity-80">
                    Free updates and bug fixes for 1 year
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Contact for Pricing
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-black hover:text-white dark:text-white hover:bg-blue-700"
                >
                  <Star className="w-5 h-5 mr-2" />
                  View Demo First
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
