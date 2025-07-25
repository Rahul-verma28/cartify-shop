"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

// Redux imports
import { useAppDispatch } from "@/lib/hooks/use-redux"
import { createAdminProduct, updateAdminProduct } from "@/lib/redux/slices/adminProductsSlice"

// shadcn UI imports
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const productSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be positive"),
  category: z.string().min(1, "Category is required"),
  inventory: z.number().min(0, "Inventory must be non-negative"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  tags: z.array(z.string()).optional(),
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
  productId?: string
  initialData?: Partial<ProductFormData>
  mode: "create" | "edit"
}

export default function ProductForm({ productId, initialData, mode }: ProductFormProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      category: initialData?.category || "",
      inventory: initialData?.inventory || 0,
      images: initialData?.images || [""],
      tags: initialData?.tags || [],
    },
  })

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true)
    try {
      if (mode === "create") {
        await dispatch(createAdminProduct(data)).unwrap()
        toast.success("Product created successfully")
      } else if (mode === "edit" && productId) {
        await dispatch(updateAdminProduct({ productId, productData: data })).unwrap()
        toast.success("Product updated successfully")
      }
      router.push("/admin/products")
    } catch (error) {
      toast.error(`Failed to ${mode} product`)
      console.error(`${mode} product error:`, error)
    } finally {
      setIsLoading(false)
    }
  }

  const categories = [
    { value: "electronics", label: "Electronics" },
    { value: "fashion", label: "Fashion" },
    { value: "home-garden", label: "Home & Garden" },
    { value: "sports", label: "Sports" },
    { value: "books", label: "Books" },
    { value: "beauty", label: "Beauty" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {mode === "create" ? "Create Product" : "Edit Product"}
        </h1>
        <p className="text-muted-foreground">
          {mode === "create" ? "Add a new product to your inventory" : "Update product information"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
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
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>Number of items in stock</FormDescription>
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

              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URLs</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        {field.value.map((url, index) => (
                          <div key={`${url}-${index}`} className="flex gap-2">
                            <Input
                              placeholder="Enter image URL"
                              value={url}
                              onChange={(e) => {
                                const newImages = [...field.value]
                                newImages[index] = e.target.value
                                field.onChange(newImages)
                              }}
                            />
                            {field.value.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  const newImages = field.value.filter((_, i) => i !== index)
                                  field.onChange(newImages)
                                }}
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => field.onChange([...field.value, ""])}
                        >
                          Add Image
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>Add one or more image URLs for the product</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/products")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {(() => {
                    if (isLoading) return "Saving..."
                    return mode === "create" ? "Create Product" : "Update Product"
                  })()}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
