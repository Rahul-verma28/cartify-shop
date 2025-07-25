"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

// Redux imports
import { useAppDispatch } from "@/lib/hooks/use-redux";
import {
  createAdminProduct,
  updateAdminProduct,
} from "@/lib/redux/slices/adminProductsSlice";

// Helper imports
import { createMultipleImageUrls } from "@/lib/helper/getImageUrl";

// shadcn UI imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const productSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be positive"),
  category: z.string().min(1, "Category is required"),
  inventory: z.number().min(0, "Inventory must be non-negative"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  tags: z.array(z.string()).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormWithUploadProps {
  productId?: string;
  initialData?: Partial<ProductFormData>;
  mode: "create" | "edit";
}

export default function ProductFormWithUpload({
  productId,
  initialData,
  mode,
}: ProductFormWithUploadProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      category: initialData?.category || "",
      inventory: initialData?.inventory || 0,
      images: initialData?.images || [],
      tags: initialData?.tags || [],
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    // Validate files
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    console.log("Selected files:", validFiles);

    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    if (selectedFiles.length === 0) return [];

    console.log("Uploading images:", selectedFiles);

    setUploadingImages(true);
    try {
      const imageUrls = await createMultipleImageUrls({
        images: selectedFiles,
        folder: "products",
      });
      toast.success(`${imageUrls.length} images uploaded successfully`);
      setSelectedFiles([]); // Clear selected files after upload
      console.log("Uploaded image URLs:", imageUrls);
      return imageUrls;
    } catch (error) {
      toast.error("Failed to upload images");
      console.error("Image upload error:", error);
      return [];
    } finally {
      setUploadingImages(false);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    console.log("🚀 Form submission started");
    console.log("📋 Form data received:", data);
    alert("🎯 Form submitted! Check console for details.");
    setIsLoading(true);
    console.log("Submitting product data:", data);
    try {
      // Upload new images if any are selected
      const newImageUrls = await uploadImages();

      // Combine existing images with new ones
      const allImages = [...data.images, ...newImageUrls];

      if (allImages.length === 0) {
        toast.error("At least one image is required");
        setIsLoading(false);
        return;
      }

      const productData = {
        ...data,
        images: allImages,
      };

      if (mode === "create") {
        await dispatch(createAdminProduct(productData)).unwrap();
        toast.success("Product created successfully");
      } else if (mode === "edit" && productId) {
        await dispatch(updateAdminProduct({ productId, productData })).unwrap();
        toast.success("Product updated successfully");
      }
      router.push("/admin/products");
    } catch (error) {
      toast.error(`Failed to ${mode} product`);
      console.error(`${mode} product error:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeExistingImage = (index: number) => {
    const currentImages = form.getValues("images");
    const newImages = currentImages.filter((_, i) => i !== index);
    form.setValue("images", newImages);
  };

  const categories = [
    { value: "electronics", label: "Electronics" },
    { value: "fashion", label: "Fashion" },
    { value: "home-garden", label: "Home & Garden" },
    { value: "sports", label: "Sports" },
    { value: "books", label: "Books" },
    { value: "beauty", label: "Beauty" },
  ];

  const currentImages = form.watch("images");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {mode === "create" ? "Create Product" : "Edit Product"}
        </h1>
        <p className="text-muted-foreground">
          {mode === "create"
            ? "Add a new product to your inventory"
            : "Update product information"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.value}
                              value={category.value}
                            >
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="inventory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inventory</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Number of items in stock
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter product description"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Existing Images */}
              {currentImages.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-3">Current Images</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {currentImages.map((url, index) => (
                      <div key={`existing-${url}`} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={url}
                            alt={`Product image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeExistingImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* File Upload */}
              <div>
                <label className="text-sm font-medium">Add New Images</label>
                <div className="mt-2">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, JPEG up to 5MB each
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Selected Files Preview */}
              {selectedFiles.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-3">
                    Selected Files ({selectedFiles.length})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="relative group"
                      >
                        <div className="aspect-square rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {file.name}
                        </p>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/products")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || uploadingImages} onClick={() => {
              console.log("🔘 Submit button clicked");
              console.log("📊 Form state:", {
                isValid: form.formState.isValid,
                errors: form.formState.errors,
                values: form.getValues()
              });
            }}>
              {(() => {
                if (isLoading) return "Saving...";
                if (uploadingImages) return "Uploading...";
                return mode === "create" ? "Create Product" : "Update Product";
              })()}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
