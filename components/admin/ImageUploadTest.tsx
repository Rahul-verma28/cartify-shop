"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Upload, X, Check, AlertCircle } from "lucide-react";
import Image from "next/image";

// Import your helper functions
import { createImageUrl, createMultipleImageUrls, deleteImageFromStorage } from "@/helper/getImageUrl";

// shadcn UI imports
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

type TestStatus = 'pending' | 'success' | 'error';

export default function ImageUploadTest() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [testResults, setTestResults] = useState<{
    singleUpload: TestStatus;
    multipleUpload: TestStatus;
    deleteTest: TestStatus;
  }>({
    singleUpload: 'pending',
    multipleUpload: 'pending',
    deleteTest: 'pending'
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
    console.log("✅ Files selected:", files.map(f => f.name));
  };

  const testSingleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file first");
      return;
    }

    setIsUploading(true);
    console.log("🧪 Testing single image upload...");

    try {
      const url = await createImageUrl({ 
        image: selectedFiles[0], 
        folder: 'test-uploads' 
      });
      
      setUploadedUrls(prev => [...prev, url]);
      setTestResults(prev => ({ ...prev, singleUpload: 'success' }));
      toast.success("Single upload test passed!");
      console.log("✅ Single upload successful:", url);
    } catch (error) {
      setTestResults(prev => ({ ...prev, singleUpload: 'error' }));
      toast.error(`Single upload failed: ${error}`);
      console.error("❌ Single upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const testMultipleUpload = async () => {
    if (selectedFiles.length < 2) {
      toast.error("Please select at least 2 files to test multiple upload");
      return;
    }

    setIsUploading(true);
    console.log("🧪 Testing multiple image upload...");

    try {
      const urls = await createMultipleImageUrls({ 
        images: selectedFiles.slice(0, 3), // Test with max 3 files
        folder: 'test-uploads' 
      });
      
      setUploadedUrls(prev => [...prev, ...urls]);
      setTestResults(prev => ({ ...prev, multipleUpload: 'success' }));
      toast.success(`Multiple upload test passed! Uploaded ${urls.length} images`);
      console.log("✅ Multiple upload successful:", urls);
    } catch (error) {
      setTestResults(prev => ({ ...prev, multipleUpload: 'error' }));
      toast.error(`Multiple upload failed: ${error}`);
      console.error("❌ Multiple upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const testDeleteImage = async () => {
    if (uploadedUrls.length === 0) {
      toast.error("No uploaded images to delete. Upload some images first.");
      return;
    }

    const urlToDelete = uploadedUrls[0];
    console.log("🧪 Testing image deletion...");

    try {
      await deleteImageFromStorage(urlToDelete);
      setUploadedUrls(prev => prev.filter(url => url !== urlToDelete));
      setTestResults(prev => ({ ...prev, deleteTest: 'success' }));
      toast.success("Delete test passed!");
      console.log("✅ Image deletion successful");
    } catch (error) {
      setTestResults(prev => ({ ...prev, deleteTest: 'error' }));
      toast.error(`Delete failed: ${error}`);
      console.error("❌ Image deletion failed:", error);
    }
  };

  const clearAll = () => {
    setSelectedFiles([]);
    setUploadedUrls([]);
    setTestResults({
      singleUpload: 'pending',
      multipleUpload: 'pending',
      deleteTest: 'pending'
    });
    toast.info("Test data cleared");
  };

  const getStatusIcon = (status: TestStatus) => {
    switch (status) {
      case 'success': return <Check className="h-4 w-4 text-green-500" />;
      case 'error': return <X className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">🧪 Image Upload Test Suite</h1>
        <p className="text-muted-foreground">Test Firebase image upload functionality</p>
      </div>

      {/* File Selection */}
      <Card>
        <CardHeader>
          <CardTitle>1. Select Test Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to select test images
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
            
            {selectedFiles.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Selected files ({selectedFiles.length}):</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {selectedFiles.map((file) => (
                    <li key={`${file.name}-${file.size}`}>• {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle>2. Run Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              onClick={testSingleUpload} 
              disabled={isUploading || selectedFiles.length === 0}
              className="flex items-center gap-2"
            >
              {getStatusIcon(testResults.singleUpload)}
              Single Upload
            </Button>
            
            <Button 
              onClick={testMultipleUpload} 
              disabled={isUploading || selectedFiles.length < 2}
              className="flex items-center gap-2"
            >
              {getStatusIcon(testResults.multipleUpload)}
              Multiple Upload
            </Button>
            
            <Button 
              onClick={testDeleteImage} 
              disabled={uploadedUrls.length === 0}
              variant="destructive"
              className="flex items-center gap-2"
            >
              {getStatusIcon(testResults.deleteTest)}
              Test Delete
            </Button>
            
            <Button onClick={clearAll} variant="outline">
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>3. Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {getStatusIcon(testResults.singleUpload)}
              <span>Single Image Upload: {testResults.singleUpload}</span>
            </div>
            <div className="flex items-center gap-3">
              {getStatusIcon(testResults.multipleUpload)}
              <span>Multiple Image Upload: {testResults.multipleUpload}</span>
            </div>
            <div className="flex items-center gap-3">
              {getStatusIcon(testResults.deleteTest)}
              <span>Image Deletion: {testResults.deleteTest}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Images Display */}
      {uploadedUrls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>4. Uploaded Images ({uploadedUrls.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {uploadedUrls.map((url, index) => (
                <div key={url} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={url}
                      alt={`Uploaded image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    Image {index + 1}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>How to use:</strong>
          <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
            <li>Select one or more test images</li>
            <li>Run the single upload test first</li>
            <li>Select multiple images and test multiple upload</li>
            <li>Test image deletion functionality</li>
            <li>Check console logs for detailed information</li>
          </ol>
        </AlertDescription>
      </Alert>
    </div>
  );
}
