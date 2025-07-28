"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/lib/redux/store";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  ChevronRightIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();
  const { items, total } = useSelector((state: RootState) => state.cart);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (items.length === 0) {
      router.push("/");
    }
  }, [items, router]);

  const handleCheckout = async (shippingData: any) => {
    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product?._id,
            quantity: item.quantity,
            price: item.product?.price,
          })),
          shippingAddress: shippingData,
          total,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to Stripe Checkout
        const stripe = await import("@stripe/stripe-js").then((m) =>
          m.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
        );

        if (stripe) {
          await stripe.redirectToCheckout({
            sessionId: data.sessionId,
          });
        }
      } else {
        toast.error(data.error || "Checkout failed");
      }
    } catch (error) {
      toast.error("An error occurred during checkout");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Skeleton */}
            <div className="mb-8">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4 animate-pulse"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
            </div>

            {/* Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-6 animate-pulse"></div>
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-6 animate-pulse"></div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session || items.length === 0) {
    return null;
  }

  const breadcrumbs = [
    { name: "Home", href: "/", current: false },
    { name: "Cart", href: "/cart", current: false },
    { name: "Checkout", href: "/checkout", current: true },
  ];

  const steps = [
    { name: "Cart", icon: ShoppingBagIcon, status: "complete" },
    { name: "Checkout", icon: CreditCardIcon, status: "current" },
    { name: "Confirmation", icon: CheckCircleIcon, status: "upcoming" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          {/* Breadcrumb Navigation */}
          <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              {breadcrumbs.map((breadcrumb, index) => (
                <li key={breadcrumb.name}>
                  <div className="flex items-center">
                    {index > 0 && (
                      <ChevronRightIcon className="h-4 w-4 text-gray-400 mr-2" />
                    )}
                    <a
                      href={breadcrumb.href}
                      className={`text-sm font-medium ${
                        breadcrumb.current
                          ? "text-primary-600 dark:text-primary-400"
                          : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      }`}
                      aria-current={breadcrumb.current ? "page" : undefined}
                    >
                      {breadcrumb.name}
                    </a>
                  </div>
                </li>
              ))}
            </ol>
          </nav>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              {steps.map((step, stepIdx) => (
                <div key={step.name} className="flex items-center">
                  <div className="flex items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                        step.status === "complete"
                          ? "border-primary-600 bg-primary-600"
                          : step.status === "current"
                          ? "border-primary-600 bg-white dark:bg-gray-800"
                          : "border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600"
                      }`}
                    >
                      <step.icon
                        className={`h-5 w-5 ${
                          step.status === "complete"
                            ? "text-white"
                            : step.status === "current"
                            ? "text-primary-600"
                            : "text-gray-400"
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-3">
                      <p
                        className={`text-sm font-medium ${
                          step.status === "current"
                            ? "text-primary-600 dark:text-primary-400"
                            : step.status === "complete"
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {step.name}
                      </p>
                    </div>
                  </div>
                  {stepIdx !== steps.length - 1 && (
                    <div className="ml-8 mr-8 h-0.5 w-16 bg-gray-300 dark:bg-gray-600" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Page Header */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-gray-900 dark:text-white mb-3"
            >
              Secure Checkout
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-600 dark:text-gray-400"
            >
              Review your order and complete your purchase
            </motion.p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="order-2 lg:order-1"
            >
              <CheckoutForm onSubmit={handleCheckout} loading={loading} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="order-1 lg:order-2"
            >
              <div className="sticky top-8">
                <OrderSummary items={items} total={total} />
              </div>
            </motion.div>
          </div>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Your payment information is secure and encrypted</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Loading Overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl text-center max-w-sm mx-4"
              >
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Processing Payment
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Please wait while we securely process your order...
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
