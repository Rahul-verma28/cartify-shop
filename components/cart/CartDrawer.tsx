"use client";

import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/lib/redux/store";
import { removeFromCart, updateQuantity } from "@/lib/redux/slices/cartSlice";
import { toggleCartDrawer } from "@/lib/redux/slices/uiSlice";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Plus, Minus, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function CartDrawer() {
  const dispatch = useDispatch();
  const { items, total, itemCount } = useSelector((state: RootState) => state.cart);
  const isCartDrawerOpen = useSelector((state: RootState) => state.ui.cartDrawerOpen);

  const handleClose = () => {
    dispatch(toggleCartDrawer());
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch(removeFromCart(productId));
    } else {
      dispatch(updateQuantity({ productId, quantity }));
    }
  };

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  return (
    <Sheet open={isCartDrawerOpen} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({itemCount})</SheetTitle>
          <SheetDescription>
            {items.length === 0 ? "Your cart is empty" : "Review your items before checkout"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto py-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium">Your cart is empty</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Start adding some items to your cart!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.product?._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-4 p-4 border rounded-lg"
                    >
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                        <Image
                          src={
                            item.product?.images?.[0] ||
                            "/placeholder.svg?height=100&width=100"
                          }
                          alt={item.product?.title}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium">
                              <Link
                                href={`/products/${item.product?.slug}`}
                                onClick={handleClose}
                                className="hover:text-primary"
                              >
                                {item.product?.title}
                              </Link>
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {item.product?.category}
                            </p>
                          </div>
                          <p className="text-sm font-medium">${item.product?.price}</p>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                handleQuantityChange(
                                  item.product?._id,
                                  item.quantity - 1
                                )
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                handleQuantityChange(
                                  item.product?._id,
                                  item.quantity + 1
                                )
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleRemoveItem(item.product?._id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t pt-6 space-y-4">
              <div className="flex justify-between text-base font-medium">
                <p>Subtotal</p>
                <p>${total.toFixed(2)}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Shipping and taxes calculated at checkout.
              </p>
              
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/checkout" onClick={handleClose}>
                    Checkout
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleClose}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
