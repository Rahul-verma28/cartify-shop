"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Upload, Copy, ExternalLink } from "lucide-react";
import Image from "next/image";

// Import your helper functions
import { createImageUrl, createMultipleImageUrls } from "@/helper/getImageUrl";

// shadcn UI imports
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function FirebaseUrlDemo() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const uploadAndGetUrls = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select files first");
      return;
    }

    setIsUploading(true);
    try {
      console.log("🚀 Starting upload process...");
      
      // Upload images and get URLs back
      const urls = await createMultipleImageUrls({ 
        images: selectedFiles, 
        folder: 'demo-uploads' 
      });
      
      console.log("📋 All URLs received:", urls);
      
      // Store the URLs (this is what you'd save to your database)
      setUploadedUrls(urls);
      
      toast.success(`Successfully uploaded ${urls.length} images and got URLs!`);
      
      // Clear selected files
      setSelectedFiles([]);
      
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(`Upload failed: ${error}`);
    } finally {
      setIsUploading(false);
    }
  };

  const copyUrlToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard!");
  };

  const openUrlInNewTab = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">🔗 Firebase Storage URL Demo</h1>
        <p className="text-muted-foreground">Upload images and get Firebase Storage URLs</p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Images to Firebase Storage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="file-upload">Select Images</Label>
            <div className="mt-2">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                  </div>
                  <input
                    id="file-upload"
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

          {selectedFiles.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Selected: {selectedFiles.length} files</p>
              <ul className="text-sm text-muted-foreground space-y-1 max-h-20 overflow-y-auto">
                {selectedFiles.map((file) => (
                  <li key={`${file.name}-${file.size}`}>• {file.name}</li>
                ))}
              </ul>
            </div>
          )}

          <Button 
            onClick={uploadAndGetUrls} 
            disabled={isUploading || selectedFiles.length === 0}
            className="w-full"
          >
            {isUploading ? "Uploading..." : `Upload ${selectedFiles.length} Image(s) and Get URLs`}
          </Button>
        </CardContent>
      </Card>

      {/* URLs Display */}
      {uploadedUrls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>📋 Generated Firebase Storage URLs ({uploadedUrls.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {uploadedUrls.map((url, index) => (
              <div key={url} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Image {index + 1}</h4>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyUrlToClipboard(url)}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy URL
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openUrlInNewTab(url)}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Open
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Image Preview */}
                  <div className="aspect-video relative rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={url}
                      alt={`Uploaded image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  {/* URL Display */}
                  <div className="space-y-2">
                    <Label>Firebase Storage URL:</Label>
                    <Input 
                      value={url} 
                      readOnly 
                      className="font-mono text-xs"
                    />
                    <p className="text-xs text-muted-foreground">
                      This URL can be saved to your database and used anywhere in your app
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Code Example */}
      <Card>
        <CardHeader>
          <CardTitle>💻 How to Use in Your Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-lg p-4 font-mono text-sm space-y-2">
            <div className="text-green-600">// Upload single image</div>
            <div>const url = await createImageUrl({`{`} image: file, folder: 'products' {`}`});</div>
            <div className="text-green-600">// Upload multiple images</div>
            <div>const urls = await createMultipleImageUrls({`{`} images: files, folder: 'products' {`}`});</div>
            <div className="text-green-600">// Save URLs to database</div>
            <div>const productData = {`{`} ...otherData, images: urls {`}`};</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
