"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from "lucide-react";
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded mb-4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
          <p className="text-muted-foreground">
            Manage your product collections
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Collection
        </Button>
      </div>

      {/* Collections Table */}
      <Card>
        <CardHeader>
          <CardTitle>Collections ({collections.length})</CardTitle>
        </CardHeader>
        <CardContent>
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
                {collections.map((collection, index) => (
                  <TableRow key={collection._id} className="group">
                    <TableCell>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="w-12 h-12 relative rounded-lg overflow-hidden bg-muted"
                      >
                        <img
                          src={collection.image || "/placeholder.svg"}
                          alt={collection.title}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{collection.title}</div>
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
                          onClick={() => handleOpenViewDialog(collection)}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(collection)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setDeleteCollectionId(collection._id)
                              }
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the collection "
                                {collection.title}" from the database.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                onClick={() => setDeleteCollectionId(null)}
                              >
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
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {collections.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No collections found</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => handleOpenDialog()}
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Add your first collection
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Collection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title"  >
                Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="slug"  >
                Slug
              </Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange("slug", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description"  >
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className="col-span-3"
                placeholder="Optional description for the collection"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image"  >
                Image URL
              </Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => handleInputChange("image", e.target.value)}
                className="col-span-3"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <DialogFooter>
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
    </div>
  );
}
