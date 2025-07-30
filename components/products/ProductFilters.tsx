"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/lib/redux/store";
import { updateFilters, resetFilters } from "@/lib/redux/slices/productsSlice";
import { useNavigation } from "@/hooks/useNavigation";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Star,
  Tag,
  Palette,
  Ruler,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";

// Keep fallback data for other filters that don't come from API
const fallbackCategories = [
  "Electronics",
  "Fashion",
  "Home & Garden",
  "Sports",
  "Books",
  "Beauty",
  "Toys",
  "Automotive",
];

const priceRanges = [
  { label: "Under $25", min: 0, max: 25 },
  { label: "$25 - $50", min: 25, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100 - $200", min: 100, max: 200 },
  { label: "Over $200", min: 200, max: 1000 },
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const colors = [
  "Red",
  "Blue",
  "Green",
  "Black",
  "White",
  "Gray",
  "Pink",
  "Purple",
];
const tags = ["Sale", "New", "Popular", "Limited", "Bestseller", "Trending"];

export default function ProductFilters() {
  const dispatch = useDispatch();
  const { filters } = useSelector((state: RootState) => state.products);
  
  // Get real-time categories and collections from navigation slice
  const { categories, collections, loading, errors } = useNavigation();
  
  const [expandedSections, setExpandedSections] = useState({
    search: true,
    category: true,
    collection: false,
    price: true,
    rating: true,
    size: false,
    color: false,
    tags: false,
    featured: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSearchChange = (value: string) => {
    dispatch(updateFilters({ search: value }));
  };

  const handleCategoryChange = (category: string) => {
    dispatch(
      updateFilters({
        category: filters.category === category ? "" : category,
      })
    );
  };

  const handleCollectionChange = (collection: string) => {
    dispatch(
      updateFilters({
        collection: filters.collection === collection ? "" : collection,
      })
    );
  };

  const handleSizeToggle = (size: string) => {
    const newSizes = filters.size?.includes(size)
      ? filters.size.filter((s) => s !== size)
      : [...(filters.size || []), size];
    dispatch(updateFilters({ size: newSizes }));
  };

  const handleColorToggle = (color: string) => {
    const newColors = filters.color?.includes(color)
      ? filters.color.filter((c) => c !== color)
      : [...(filters.color || []), color];
    dispatch(updateFilters({ color: newColors }));
  };

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags?.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...(filters.tags || []), tag];
    dispatch(updateFilters({ tags: newTags }));
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    dispatch(updateFilters({ priceRange: [min, max] }));
  };

  const handleRatingChange = (rating: number) => {
    dispatch(
      updateFilters({
        rating: filters.rating === rating ? 0 : rating,
      })
    );
  };

  const handleReset = () => {
    dispatch(resetFilters());
  };

  // Use real categories or fallback
  const displayCategories = categories.length > 0 ? categories : fallbackCategories.map(cat => ({
    _id: cat.toLowerCase(),
    title: cat,
    slug: cat.toLowerCase()
  }));

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button onClick={handleReset} variant="ghost" size="sm">
          Reset All
        </Button>
      </div>

      {/* Search Filter */}
      <div>
        <button
          onClick={() => toggleSection("search")}
          className="flex justify-between items-center w-full text-left font-medium mb-2 text-sm"
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search
          </div>
          {expandedSections.search ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.search && (
          <Input
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        )}
      </div>

      {/* Featured Products Toggle */}
      <div>
        <button
          onClick={() => toggleSection("featured")}
          className="flex justify-between items-center w-full text-left font-medium mb-2 text-sm"
        >
          Featured Products
          {expandedSections.featured ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.featured && (
          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={filters.featured}
              onCheckedChange={(checked) =>
                dispatch(updateFilters({ featured: checked }))
              }
            />
            <Label htmlFor="featured" className="text-xs">Featured products</Label>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div>
        <button
          onClick={() => toggleSection("category")}
          className="flex justify-between items-center w-full text-left font-medium mb-2 text-sm"
        >
          Category
          {expandedSections.category ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.category && (
          <div className="space-y-2">
            {loading.categories ? (
              // Loading skeleton for categories
              [...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))
            ) : (
              displayCategories.map((category) => (
                <div key={category._id || category.title} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.title || category._id}
                    checked={filters.category === (category.title || category._id)}
                    onCheckedChange={() =>
                      handleCategoryChange(category.title || category._id)
                    }
                  />
                  <Label htmlFor={category.title || category._id} className="text-xs">
                    {category.title}
                  </Label>
                </div>
              ))
            )}
            {errors.categories && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                ⚠️ Using fallback categories
              </p>
            )}
          </div>
        )}
      </div>

      {/* Collection Filter */}
      <div>
        <button
          onClick={() => toggleSection("collection")}
          className="flex justify-between items-center w-full text-left font-medium mb-2 text-sm"
        >
          Collections
          {expandedSections.collection ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.collection && (
          <div className="space-y-2">
            {loading.collections ? (
              // Loading skeleton for collections
              [...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))
            ) : collections.length > 0 ? (
              collections.map((collection) => (
                <div key={collection._id} className="flex items-center space-x-2">
                  <Checkbox
                    id={collection._id}
                    checked={filters.collection === collection._id}
                    onCheckedChange={() => handleCollectionChange(collection._id)}
                  />
                  <Label htmlFor={collection._id} className="text-xs">
                    {collection.title}
                  </Label>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                No collections available
              </p>
            )}
            {errors.collections && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                ⚠️ Using fallback collections
              </p>
            )}
          </div>
        )}
      </div>

      {/* Size Filter */}
      <div>
        <button
          onClick={() => toggleSection("size")}
          className="flex justify-between items-center w-full text-left font-medium mb-2 text-sm"
        >
          <div className="flex items-center gap-2">
            Size
          </div>
          {expandedSections.size ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.size && (
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <Badge
                key={size}
                variant={filters.size?.includes(size) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleSizeToggle(size)}
              >
                {size}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Color Filter */}
      <div>
        <button
          onClick={() => toggleSection("color")}
          className="flex justify-between items-center w-full text-left font-medium mb-2 text-sm"
        >
          <div className="flex items-center gap-2">
            Color
          </div>
          {expandedSections.color ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.color && (
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <Badge
                key={color}
                variant={filters.color?.includes(color) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleColorToggle(color)}
              >
                {color}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Tags Filter */}
      <div>
        <button
          onClick={() => toggleSection("tags")}
          className="flex justify-between items-center w-full text-left font-medium mb-2 text-sm"
        >
          <div className="flex items-center gap-2">
            Tags
          </div>
          {expandedSections.tags ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.tags && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant={filters.tags?.includes(tag) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div>
        <button
          onClick={() => toggleSection("price")}
          className="flex justify-between items-center w-full text-left font-medium mb-2 text-sm"
        >
          Price Range
          {expandedSections.price ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.price && (
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <div key={range.label} className="flex items-center space-x-2">
                <Checkbox
                  id={range.label}
                  checked={
                    filters.priceRange[0] === range.min &&
                    filters.priceRange[1] === range.max
                  }
                  onCheckedChange={() =>
                    dispatch(
                      updateFilters({ priceRange: [range.min, range.max] })
                    )
                  }
                />
                <Label htmlFor={range.label} className="text-xs">
                  {range.label}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rating Filter */}
      <div>
        <button
          onClick={() => toggleSection("rating")}
          className="flex justify-between items-center w-full text-left font-medium mb-2 text-sm"
        >
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Rating
          </div>
          {expandedSections.rating ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.rating && (
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={filters.rating === rating}
                  onCheckedChange={() =>
                    dispatch(
                      updateFilters({
                        rating: filters.rating === rating ? 0 : rating,
                      })
                    )
                  }
                />
                <Label
                  htmlFor={`rating-${rating}`}
                  className="flex items-center text-xs"
                >
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-1">& up</span>
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
