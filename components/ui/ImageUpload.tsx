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
      <div className="flex flex-wrap gap-4 mb-4">
        {value.map((url, index) => (
          <Card
            key={url}
            className="relative group overflow-hidden h-40 w-40 p-0 border-dashed"
          >
            <div className="relative h-full w-full">
              <Image
                src={url}
                alt={`Product image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(url)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}

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
                className="h-40 w-40 flex flex-col items-center justify-center border-dashed gap-2"
                onClick={() => open()}
              >
                <ImagePlus className="h-6 w-6" />
                <span className="text-sm">Upload image</span>
              </Button>
            )}
          </CldUploadWidget>
        )}
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
