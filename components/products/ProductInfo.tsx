"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RefreshCw,
  Minus,
  Plus,
  Check,
  Zap,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { RatingStars } from "@/components/products/RatingStars";
import type { RootState } from "@/lib/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/lib/redux/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/lib/redux/slices/wishlistSlice";
import { toast } from "sonner";

interface ProductInfoProps {
  product: any;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  addedToCart: boolean;
  onSizeChange: (size: string) => void;
  onColorChange: (color: string) => void;
  onQuantityChange: (quantity: number) => void;
  onShare: () => void;
}

export function ProductInfo({
  product,
  selectedSize,
  selectedColor,
  quantity,
  addedToCart,
  onSizeChange,
  onColorChange,
  onQuantityChange,
  onShare,
}: ProductInfoProps) {
  const dispatch = useDispatch();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const wishlistItems = useSelector(
    (state: RootState) => state.wishlist?.items
  );
  const isInWishlist = wishlistItems.includes(product?._id);
  const handleAddToCart = async () => {
    if (!product) return;

    // Validate required selections
    if (product.size && product.size.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (product.color && product.color.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }

    if (product.inventory === 0) {
      toast.error("Product is out of stock");
      return;
    }

    if (quantity > product.inventory) {
      toast.error(`Only ${product.inventory} units available`);
      return;
    }

    try {
      setIsAddingToCart(true);

      const cartItem = {
        product: {
          ...product,
          selectedSize,
          selectedColor,
        },
        quantity,
      };

      dispatch(addToCart(cartItem));
      toast.success(`Added ${quantity} item(s) to cart!`);
    } catch (error) {
      toast.error("Failed to add item to cart");
      console.error("Add to cart error:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!product?._id) return;

    try {
      if (isInWishlist) {
        dispatch(removeFromWishlist(product._id));
        toast.success("Removed from wishlist");
      } else {
        dispatch(addToWishlist(product._id));
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
      console.error("Wishlist error:", error);
    }
  };

  const isOutOfStock = !product?.inventory || product.inventory === 0;
  const isLowStock = product?.inventory > 0 && product.inventory <= 5;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="space-y-6"
    >
      {/* Product Header */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          {product.featured && (
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
              <Zap className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
          <Badge variant="outline" className="capitalize">
            {product.category?.replace("-", " ")}
          </Badge>
        </div>

        <h1 className="text-xl md:text-3xl font-bold mb-4">{product.title}</h1>

        {product.rating && (
          <div className="flex items-center space-x-4 mb-4">
            <RatingStars rating={product.rating.average} size="md" showValue />
            <span className="text-muted-foreground">
              ({product.rating.count} reviews)
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center space-x-4 mb-4">
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
            ${product.price?.toFixed(2)}
          </span>
          {product.comparePrice && product.comparePrice > product.price && (
            <>
              <span className="text-md text-gray-500 line-through">
                ${product.comparePrice.toFixed(2)}
              </span>
              <Badge variant="destructive">
                {Math.round(
                  ((product.comparePrice - product.price) /
                    product.comparePrice) *
                    100
                )}
                % OFF
              </Badge>
            </>
          )}
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-md leading-relaxed mb-4">
          {product.description}
        </p>
      </div>

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag: string) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Product Options */}
      <div className="space-y-4">
        {/* Size Selection */}
        {product.size && product.size.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-3 text-gray-900 dark:text-white">
              Size:{" "}
              {selectedSize && (
                <span className="font-normal text-blue-600">
                  {selectedSize}
                </span>
              )}
            </label>
            <div className="flex flex-wrap gap-2">
              {product.size.map((size: string) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  size="sm"
                  onClick={() => onSizeChange(size)}
                  className="min-w-[3rem] h-10"
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Color Selection */}
        {product.color && product.color.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-3 text-gray-900 dark:text-white">
              Color:{" "}
              {selectedColor && (
                <span className="font-normal text-blue-600 capitalize">
                  {selectedColor}
                </span>
              )}
            </label>
            <div className="flex flex-wrap gap-2">
              {product.color.map((color: string) => (
                <Button
                  key={color}
                  variant={selectedColor === color ? "default" : "outline"}
                  size="sm"
                  onClick={() => onColorChange(color)}
                  className={`capitalize min-w-[4rem] h-10 ${
                    selectedColor === color
                      ? "ring-2 ring-blue-500 ring-offset-2"
                      : "hover:ring-1 hover:ring-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full border border-gray-300"
                      style={{
                        backgroundColor:
                          color.toLowerCase() === "white"
                            ? "#ffffff"
                            : color.toLowerCase(),
                      }}
                    />
                    <span>{color}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity Selection */}
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-900 dark:text-white">
            Quantity:
          </label>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-10 h-10 p-0"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-16 text-center font-semibold text-lg">
              {quantity}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onQuantityChange(
                  Math.min(product.inventory || 99, quantity + 1)
                )
              }
              disabled={quantity >= (product.inventory || 99)}
              className="w-10 h-10 p-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stock Status */}
        <div className="flex items-center space-x-2">
          {isOutOfStock ? (
            <>
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span className="text-sm">
                <span className="font-medium text-red-600">Out of Stock</span>
              </span>
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">
                <span
                  className={`font-medium ${
                    isLowStock ? "text-orange-600" : "text-green-600"
                  }`}
                >
                  {isLowStock ? "Low Stock" : "In Stock"}
                </span>{" "}
                - {product.inventory} units available
              </span>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            size="sm"
            className="w-full text-md py-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
            onClick={handleAddToCart}
            disabled={addedToCart || isAddingToCart || isOutOfStock}
          >
            {isAddingToCart ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 mr-2"
                >
                  <RefreshCw className="w-5 h-5" />
                </motion.div>
                Adding...
              </>
            ) : addedToCart ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Added to Cart!
              </>
            ) : isOutOfStock ? (
              "Out of Stock"
            ) : (
              <>
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </>
            )}
          </Button>
        </motion.div>

        <div className="flex space-x-3">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={handleWishlistToggle}
          >
            <Heart
              className={`w-5 h-5 mr-2 transition-colors ${
                isInWishlist
                  ? "fill-red-500 text-red-500"
                  : "text-gray-500 hover:text-red-500"
              }`}
            />
            {isInWishlist ? "Saved" : "Save"}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={onShare}
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Product Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
        <div className="flex items-center space-x-2">
          <Truck className="w-5 h-5 text-green-600" />
          <span className="text-sm">Free Shipping</span>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <span className="text-sm">2 Year Warranty</span>
        </div>
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 text-purple-600" />
          <span className="text-sm">30-Day Returns</span>
        </div>
      </div>
    </motion.div>
  );
}
