"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"

// Redux imports
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux"
import {
  fetchAdminProducts,
  deleteAdminProduct,
  setSearchTerm,
  setSelectedCategory,
  selectFilteredProducts,
} from "@/redux/slices/adminProductsSlice"

// shadcn UI imports
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function AdminProductsPage() {
  const dispatch = useAppDispatch()
  const { 
    loading, 
    error, 
    searchTerm, 
    selectedCategory 
  } = useAppSelector((state) => state.adminProducts)
  
  const filteredProducts = useAppSelector(selectFilteredProducts)
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchAdminProducts())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleDeleteProduct = async () => {
    if (!deleteProductId) return

    try {
      await dispatch(deleteAdminProduct(deleteProductId)).unwrap()
      toast.success("Product deleted successfully")
      setDeleteProductId(null)
    } catch (err) {
      console.error("Delete product error:", err)
      toast.error("Failed to delete product")
    }
  }

  const handleSearchChange = (value: string) => {
    dispatch(setSearchTerm(value))
  }

  const handleCategoryChange = (value: string) => {
    dispatch(setSelectedCategory(value === "all" ? "" : value))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded mb-4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Filters Card */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={selectedCategory || "all"} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="home-garden">Home & Garden</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="books">Books</SelectItem>
                  <SelectItem value="beauty">Beauty</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product: any, index: number) => (
                  <TableRow
                    key={product?._id}
                    className="group"
                  >
                    <TableCell>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={product?.images?.[0] || "/placeholder.svg"}
                            alt={product?.title || "Product"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{product?.title}</div>
                          <div className="text-sm text-muted-foreground">{product?.slug}</div>
                        </div>
                      </motion.div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{product?.category}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">${product?.price}</TableCell>
                    <TableCell>{product?.inventory}</TableCell>
                    <TableCell>
                      <Badge
                        variant={product?.inventory > 0 ? "default" : "destructive"}
                      >
                        {product?.inventory > 0 ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/products/${product?.slug}`}>
                            <EyeIcon className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/products/${product?._id}/edit`}>
                            <PencilIcon className="h-4 w-4" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteProductId(product?._id)}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the
                                product "{product?.title}" from the database.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setDeleteProductId(null)}>
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleDeleteProduct}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/admin/products/new">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add your first product
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
