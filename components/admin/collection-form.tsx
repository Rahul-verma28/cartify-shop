"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ImageUpload from "@/components/ui/image-upload";
import type { Collection } from "@/lib/types";

interface CollectionFormProps {
  mode: "create" | "edit";
  collectionId?: string;
  initialData?: {
    title: string;
    slug: string;
    description: string;
    image: string;
  };
}

export default function CollectionForm({ mode, collectionId, initialData }: CollectionFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    image: "",
  });
  const [loading, setLoading] = useState(mode === "edit" && !initialData);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode === "edit" && collectionId && !initialData) {
      fetchCollection();
    } else if (initialData) {
      setFormData(initialData);
      setLoading(false);
    }
  }, [mode, collectionId, initialData]);

  const fetchCollection = async () => {
    if (!collectionId) return;
    
    try {
      const response = await fetch(`/api/admin/collections/${collectionId}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          title: data.collection.title,
          slug: data.collection.slug,
          description: data.collection.description || "",
          image: data.collection.image || "",
        });
      } else {
        toast.error("Collection not found");
        router.push("/admin/collections");
      }
    } catch (error) {
      console.error("Error fetching collection:", error);
      toast.error("Failed to fetch collection");
      router.push("/admin/collections");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "title" && mode === "create") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (
      !formData.title ||
      !formData.slug ||
      !formData.description ||
      !formData.image
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);

    try {
      const url = mode === "create" 
        ? "/api/admin/collections" 
        : `/api/admin/collections/${collectionId}`;
      
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(`Collection ${mode === "create" ? "created" : "updated"} successfully!`);
        router.push("/admin/collections");
      } else {
        const data = await response.json();
        toast.error(data.error || `Failed to ${mode} collection`);
      }
    } catch (error) {
      console.error(error);
      toast.error(`Error ${mode === "create" ? "creating" : "updating"} collection`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Card className="w-full">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {mode === "create" ? "Add New Collection" : "Edit Collection"}
          </h1>
          <p className="text-muted-foreground">
            {mode === "create" 
              ? "Create a new collection for your products" 
              : "Update the collection details"}
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Collection Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter collection title"
                    required
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
                    placeholder="collection-slug"
                    required
                  />
                  {mode === "create" && (
                    <p className="text-sm text-muted-foreground">
                      URL-friendly name (automatically generated from title)
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Enter collection description"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2 w-[20%]">
                <Label>
                  Collection Image <span className="text-red-500">*</span>
                </Label>
                <ImageUpload
                  value={formData.image}
                  onChange={(value) =>
                    handleInputChange("image", value as string)
                  }
                  multiple={false}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving || !formData.image}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving
                    ? `${mode === "create" ? "Creating" : "Updating"}...`
                    : `${mode === "create" ? "Create" : "Update"} Collection`}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
