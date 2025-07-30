"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Github,
  Linkedin,
  Instagram,
  Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function Footer() {
  const footerLinks = {
    products: [
      { name: "All Products", href: "/products" },
      { name: "Categories", href: "/#categories" },
      { name: "Collections", href: "/#collections" },
      { name: "New Arrivals", href: "/" },
      { name: "Deals", href: "/deals" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/" },
      { name: "Press", href: "/" },
      { name: "Blog", href: "/" },
    ],
    support: [
      { name: "Contact Us", href: "/contact" },
      { name: "FAQ", href: "/" },
      { name: "Shipping Info", href: "/" },
      { name: "Returns", href: "/" },
      { name: "Support", href: "/" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/" },
      { name: "Terms of Service", href: "/" },
      { name: "Cookie Policy", href: "/" },
      { name: "AI Assistant", href: "/" },
    ],
  };

  const socialLinks = [
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "GitHub", icon: Github, href: "https://github.com/Rahul-verma28" },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://www.linkedin.com/in/rahul-verma-09227a263",
    },
    { name: "Instagram", icon: Instagram, href: "#" },
  ];

  return (
    <footer className="bg-gray-950 text-white border-t border-gray-800">
      <div className="container mx-auto sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Link href="/" className="flex items-center space-x-2 mb-4">
                  <Image
                    src="/logo.png"
                    alt="CartifyShop Logo"
                    width={42}
                    height={42}
                  />
                  <span className="text-xl font-bold text-blue-700">
                    CartifyShop
                  </span>
                </Link>

                <p className="text-gray-300 mb-6 max-w-sm">
                  Experience the future of shopping with our Cartify e-commerce
                  platform. Discover premium products with intelligent
                  recommendations.
                </p>

                {/* Newsletter Signup */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Stay Updated</h4>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter your email"
                      className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    />
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                      <Mail className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400">
                    Get the latest products and exclusive offers delivered to
                    your inbox.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {Object.entries(footerLinks).map(([category, links], index) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <h4 className="font-semibold mb-4 capitalize text-white">
                      {category}
                    </h4>
                    <ul className="space-y-3">
                      {links.map((link) => (
                        <li key={link.name}>
                          <Link
                            href={link.href}
                            className="text-gray-300 hover:text-blue-500 hover:underline transition-colors text-sm"
                          >
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-800" />

        {/* Bottom Footer */}
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-sm text-gray-400"
            >
              © 2024 CartifyShop. All rights reserved. Built and Developed by{" "}
              <Link
                href="https://www.linkedin.com/in/rahul-verma-09227a263/"
                target="_blank"
                className="hover:underline text-blue-500 font-bold"
              >
                Rahul Verma <Link2 className="inline h-4 w-4" />
              </Link>{" "}
              with ❤️ for the shopping community.
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex space-x-4"
            >
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  className="text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                  <span className="sr-only">{social.name}</span>
                </Link>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Contact Info Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 py-6"
        >
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>rahulverma281202@gmail.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Greater Noida, IN</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
