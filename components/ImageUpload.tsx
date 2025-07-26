"use client";

import React from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { Upload, X, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  maxImages?: number;
}

const ImageUpload = ({
  value = [],
  onChange,
  maxImages = 10,
}: ImageUploadProps) => {
  const removeImage = (urlToRemove: string) => {
    onChange(value.filter((url) => url !== urlToRemove));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4 mb-4">
        {value.length < (maxImages || 10) && (
          <CldUploadWidget
            uploadPreset="lg0dlgjw"
            options={{
              sources: ["local", "url", "camera", "unsplash"],
              multiple: true,
              maxFiles: maxImages || 10,
              maxFileSize: 10000000, // 10MB
              clientAllowedFormats: [
                "jpg",
                "jpeg",
                "png",
                "gif",
                "webp",
                "svg",
              ],
              resourceType: "image",
            }}
            onSuccess={(result) => {
              const uploaded = Array.isArray(result?.info)
                ? result.info.map((file) => file.secure_url)
                : [result?.info?.secure_url];

              const newImages = [...new Set(uploaded.filter(Boolean))];

              // Use function callback to access *latest* form state
              onChange((prev: string[]) =>
                [...new Set([...prev, ...newImages])].slice(0, maxImages)
              );
            }}
          >
            {({ open }) => (
              <Button
                type="button"
                variant="outline"
                className="aspect-square flex flex-col items-center justify-center border-dashed gap-2 border-black/40 h-full min-h-[120px]"
                onClick={() => open()}
              >
                <ImagePlus className="h-6 w-6" />
                <span className="text-xs text-center">Upload image</span>
              </Button>
            )}
          </CldUploadWidget>
        )}

        {value.map((url, index) => (
          <Card
            key={url}
            className="relative group overflow-hidden aspect-square p-0 border-dashed"
          >
            <div className="relative h-full w-full">
              <Image
                src={url}
                alt={`Product image ${index + 1}`}
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                onClick={() => removeImage(url)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {value.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {value.length} of {maxImages} images uploaded
        </p>
      )}
    </div>
  );
};

export default ImageUpload;
