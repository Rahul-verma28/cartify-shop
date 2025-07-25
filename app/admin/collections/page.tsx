"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash,
  Eye,
  Search,
  Library,
  Layers,
  Tag,
  ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Collection, Product } from "@/types";

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(
    null
  );
  const [viewingCollection, setViewingCollection] = useState<Collection | null>(
    null
  );
  const [deleteCollectionId, setDeleteCollectionId] = useState<string | null>(
    null
  );
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    image: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 24 },
    },
  };

  useEffect(() => {
    fetchCollections();
    fetchProducts();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await fetch("/api/admin/collections");
      const data = await response.json();
      setCollections(data.collections || []);
    } catch (error) {
      console.error("Error fetching collections:", error);
      toast.error("Failed to fetch collections");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products?limit=100");
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleOpenDialog = (collection?: Collection) => {
    if (collection) {
      setEditingCollection(collection);
      setFormData({
        title: collection.title,
        slug: collection.slug,
        description: collection.description || "",
        image: collection.image || "",
      });
    } else {
      setEditingCollection(null);
      setFormData({ title: "", slug: "", description: "", image: "" });
    }
    setIsDialogOpen(true);
  };

  const handleOpenViewDialog = (collection: Collection) => {
    setViewingCollection(collection);
    setIsViewDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCollection(null);
    setFormData({ title: "", slug: "", description: "", image: "" });
  };

  const handleCloseViewDialog = () => {
    setIsViewDialogOpen(false);
    setViewingCollection(null);
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "title" && !editingCollection) {
      const slug = (value as string)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const method = editingCollection ? "PUT" : "POST";
      const url = editingCollection
        ? `/api/admin/collections/${editingCollection._id}`
        : "/api/admin/collections";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(
          `Collection ${
            editingCollection ? "updated" : "created"
          } successfully!`
        );
        fetchCollections();
        handleCloseDialog();
      } else {
        const data = await response.json();
        toast.error(
          data.error ||
            `Failed to ${editingCollection ? "update" : "create"} collection`
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(
        `Error ${editingCollection ? "updating" : "creating"} collection`
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteCollection = async () => {
    if (!deleteCollectionId) return;

    try {
      const response = await fetch(
        `/api/admin/collections/${deleteCollectionId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast.success("Collection deleted successfully");
        fetchCollections();
        setDeleteCollectionId(null);
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete collection");
      }
    } catch (error) {
      console.error("Error deleting collection:", error);
      toast.error("Error deleting collection");
    }
  };

  // Stats calculations
  const totalProducts = collections.reduce(
    (sum, collection) => sum + (collection.products?.length || 0),
    0
  );

  const collectionsWithImages = collections.filter(
    (collection) => collection.image && collection.image.trim() !== ""
  ).length;

  const collectionsWithDescription = collections.filter(
    (collection) =>
      collection.description && collection.description.trim() !== ""
  ).length;

  // Filter collections based on search
  const filteredCollections = collections.filter((collection) =>
    collection.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>

        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
          <p className="text-muted-foreground">
            Manage your product collections
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Collection
        </Button>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Collections
                  </p>
                  <h3 className="text-2xl font-bold">{collections.length}</h3>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <Library className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Products
                  </p>
                  <h3 className="text-2xl font-bold">{totalProducts}</h3>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-full">
                  <Layers className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    With Images
                  </p>
                  <h3 className="text-2xl font-bold">
                    {collectionsWithImages}
                  </h3>
                </div>
                <div className="p-2 bg-green-500/10 rounded-full">
                  <ImageIcon className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Search */}
      <motion.div variants={itemVariants} className="flex items-center py-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search collections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
      </motion.div>

      {/* Collections Content */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Collections ({filteredCollections.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="table" className="mb-4">
              <TabsList>
                <TabsTrigger value="table">Table View</TabsTrigger>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
              </TabsList>

              <TabsContent value="grid" className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredCollections.map((collection, index) => (
                    <motion.div
                      key={collection._id}
                      variants={itemVariants}
                      transition={{ delay: index * 0.05 }}
                      className="border rounded-lg overflow-hidden group hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-video relative">
                        <img
                          src={collection.image || "/placeholder.svg"}
                          alt={collection.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleOpenViewDialog(collection)}
                          >
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleOpenDialog(collection)}
                          >
                            <Pencil className="h-4 w-4 mr-1" /> Edit
                          </Button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium truncate">
                          {collection.title}
                        </h3>
                        <div className="flex justify-between items-center mt-2">
                          <Badge variant="secondary">
                            {collection.products?.length || 0} products
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 h-8 w-8 p-0"
                            onClick={() =>
                              setDeleteCollectionId(collection._id)
                            }
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="table">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Products</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCollections.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center h-32">
                            <p className="text-muted-foreground">
                              No collections found
                            </p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredCollections.map((collection) => (
                          <TableRow key={collection._id} className="group">
                            <TableCell>
                              <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-muted">
                                <img
                                  src={collection.image || "/placeholder.svg"}
                                  alt={collection.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = "/placeholder.svg";
                                  }}
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">
                                {collection.title}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {collection.slug}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-xs truncate">
                                {collection.description || "No description"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {collection.products?.length || 0} products
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleOpenViewDialog(collection)
                                  }
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenDialog(collection)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500"
                                  onClick={() =>
                                    setDeleteCollectionId(collection._id)
                                  }
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>

            {collections.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No collections found</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => handleOpenDialog()}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add your first collection
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Add/Edit Collection Dialog */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => !open && handleCloseDialog()}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCollection ? "Edit Collection" : "Add New Collection"}
            </DialogTitle>
            <DialogDescription>
              {editingCollection
                ? "Make changes to this collection."
                : "Add a new collection to your store."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">
                Slug <span className="text-red-500">*</span>
              </Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange("slug", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                URL-friendly name (auto-generated from title)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Optional description for the collection"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => handleInputChange("image", e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              {formData.image && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-10 w-10 relative rounded-md overflow-hidden bg-muted">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="object-cover h-full w-full"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                        toast.error("Invalid image URL");
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Image preview
                  </span>
                </div>
              )}
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={formLoading}>
                {(() => {
                  if (formLoading) return "Saving...";
                  if (editingCollection) return "Save Changes";
                  return "Create Collection";
                })()}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Collection Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              View Collection: {viewingCollection?.title}
            </DialogTitle>
            <DialogDescription>
              Collection details and associated products
            </DialogDescription>
          </DialogHeader>
          {viewingCollection && (
            <div className="space-y-4">
              <div className="aspect-w-16 aspect-h-9 bg-muted rounded-lg overflow-hidden">
                {viewingCollection.image ? (
                  <img
                    src={viewingCollection.image}
                    alt={viewingCollection.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">No Image</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Description</h3>
                <p className="text-muted-foreground">
                  {viewingCollection.description || "No description provided"}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">
                  Products ({viewingCollection.products?.length || 0})
                </h3>
                {viewingCollection.products &&
                viewingCollection.products.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                    {viewingCollection.products.map((product) => {
                      const productData =
                        typeof product === "string"
                          ? products.find((p) => p._id === product)
                          : product;
                      return (
                        <div
                          key={
                            typeof product === "string" ? product : product._id
                          }
                          className="flex items-center space-x-3 p-2 border rounded"
                        >
                          {productData?.images?.[0] && (
                            <img
                              src={productData.images[0]}
                              alt={productData.title}
                              className="w-10 h-10 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {productData?.title || "Unknown Product"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ${productData?.price || 0}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No products in this collection
                  </p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseViewDialog}>
              Close
            </Button>
            <Button
              onClick={() => {
                handleCloseViewDialog();
                if (viewingCollection) handleOpenDialog(viewingCollection);
              }}
            >
              Edit Collection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteCollectionId}
        onOpenChange={(open) => !open && setDeleteCollectionId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              collection "
              {collections.find((c) => c._id === deleteCollectionId)?.title}"
              from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteCollectionId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCollection}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
