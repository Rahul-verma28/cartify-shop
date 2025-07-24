"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import type { Product, Collection } from "@/types";

interface ProductFormProps {
  product?: Partial<Product>;
  onSubmit: (data: Partial<Product>) => void;
  loading: boolean;
}

const categories = [
  { value: "electronics", label: "Electronics" },
  { value: "fashion", label: "Fashion" },
  { value: "home-garden", label: "Home & Garden" },
  { value: "sports", label: "Sports" },
  { value: "books", label: "Books" },
  { value: "beauty", label: "Beauty" },
];

const predefinedSizes = ["XS", "S", "M", "L", "XL", "XXL"];
const predefinedColors = [
  "Black",
  "White",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Purple",
  "Orange",
  "Pink",
  "Gray",
];

export default function ProductForm({
  product,
  onSubmit,
  loading,
}: ProductFormProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: product?.title || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price || 0,
    comparePrice: product?.comparePrice || 0,
    category: product?.category || "",
    tags: product?.tags || [],
    size: product?.size || [],
    color: product?.color || [],
    collections: product?.collections || [],
    inventory: product?.inventory || 0,
    featured: product?.featured || false,
    images: product?.images || [],
  });

  const [newTag, setNewTag] = useState("");
  const [newImage, setNewImage] = useState("");

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await fetch("/api/admin/collections");
      if (response.ok) {
        const data = await response.json();
        setCollections(data.collections || []);
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Product title is required");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Product description is required");
      return;
    }
    if (!formData.category) {
      toast.error("Product category is required");
      return;
    }
    if (formData.price <= 0) {
      toast.error("Product price must be greater than 0");
      return;
    }
    onSubmit(formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Auto-generate slug from title
    if (field === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const addTag = () => {
    const tagValue = newTag.trim();
    if (tagValue && !formData.tags.includes(tagValue)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagValue],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addImage = () => {
    const imageValue = newImage.trim();
    if (imageValue && !formData.images.includes(imageValue)) {
      // Basic URL validation
      try {
        new URL(imageValue);
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, imageValue],
        }));
        setNewImage("");
        toast.success("Image added successfully");
      } catch {
        toast.error("Please enter a valid URL");
      }
    }
  };

  const removeImage = (imageToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((image) => image !== imageToRemove),
    }));
  };

  const toggleSize = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      size: prev.size.includes(size)
        ? prev.size.filter((s) => s !== size)
        : [...prev.size, size],
    }));
  };

  const toggleColor = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      color: prev.color.includes(color)
        ? prev.color.filter((c) => c !== color)
        : [...prev.color, color],
    }));
  };

  const toggleCollection = (collectionId: string) => {
    setFormData((prev) => ({
      ...prev,
      collections: prev.collections.includes(collectionId)
        ? prev.collections.filter((c) => c !== collectionId)
        : [...prev.collections, collectionId],
    }));
    // Keep popover open for multiple selections
    // setOpen(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>
                Fill in the details for your new product.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Product Title *</Label>
                  <Input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter product title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    placeholder="product-slug"
                  />
                  <p className="text-sm text-muted-foreground">
                    URL-friendly version of the product name
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    rows={6}
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Enter product description"
                  />
                </div>
              </div>

              <Separator />

              {/* Images */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Product Images</Label>
                <div className="space-y-2">
                  {formData.images.map((image, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="h-12 w-12 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                        <span className="text-sm text-muted-foreground truncate max-w-xs sm:max-w-md">
                          {image}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeImage(image)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    type="url"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addImage())
                    }
                    placeholder="Add image URL"
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" onClick={addImage}>
                    Add Image
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Pricing & Inventory */}
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  Pricing & Inventory
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($) *</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        handleInputChange(
                          "price",
                          Number.parseFloat(e.target.value)
                        )
                      }
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comparePrice">Compare-at Price ($)</Label>
                    <Input
                      id="comparePrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.comparePrice}
                      onChange={(e) =>
                        handleInputChange(
                          "comparePrice",
                          Number.parseFloat(e.target.value) || 0
                        )
                      }
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inventory">Inventory</Label>
                  <Input
                    id="inventory"
                    type="number"
                    min="0"
                    value={formData.inventory}
                    onChange={(e) =>
                      handleInputChange(
                        "inventory",
                        Number.parseInt(e.target.value)
                      )
                    }
                    placeholder="0"
                  />
                </div>
              </div>

              <Separator />

              {/* Variants */}
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Sizes</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Select available sizes for this product.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {predefinedSizes.map((size) => (
                      <Button
                        key={size}
                        type="button"
                        variant={
                          formData.size.includes(size) ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => toggleSize(size)}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-base font-medium">Colors</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Select available colors for this product.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {predefinedColors.map((color) => (
                      <Button
                        key={color}
                        type="button"
                        variant={
                          formData.color.includes(color) ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => toggleColor(color)}
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Product Status */}
              <div className="space-y-2">
                <Label className="text-base font-medium">Status</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) =>
                      handleInputChange("featured", checked)
                    }
                  />
                  <Label
                    htmlFor="featured"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Featured Product
                  </Label>
                </div>
              </div>

              <Separator />

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Collections */}
              <div className="space-y-2">
                <Label>Collections</Label>
                <div className="flex flex-wrap gap-1">
                  {formData.collections
                    .map((collectionId) =>
                      collections.find((c) => c._id === collectionId)
                    )
                    .filter(Boolean)
                    .map((collection) => (
                      <Badge
                        key={collection!._id}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {collection!.title}
                        <button
                          type="button"
                          className="h-auto p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => toggleCollection(collection!._id)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                </div>
                {collections.length > 0 ? (
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between mt-2"
                      >
                        Select collections...
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput placeholder="Search collections..." />
                        <CommandEmpty>No collection found.</CommandEmpty>
                        <CommandGroup>
                          {collections.map((collection) => (
                            <CommandItem
                              key={collection._id}
                              value={collection.title}
                              onSelect={() => {
                                toggleCollection(collection._id);
                              }}
                            >
                              {collection.title}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No collections available.
                  </p>
                )}
              </div>

              <Separator />

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-1">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        className="h-auto p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                    placeholder="Add a tag"
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : product
            ? "Update Product"
            : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
