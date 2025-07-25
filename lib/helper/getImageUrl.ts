import { db, storage } from "@/lib/firebase";
import { collection, doc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";

interface CreateImageUrlParams {
  image: File;
  folder?: string; // Optional folder name, defaults to 'categories'
}

interface CreateMultipleImageUrlsParams {
  images: File[];
  folder?: string;
}

export const createImageUrl = async ({ image, folder = 'categories' }: CreateImageUrlParams): Promise<string> => {
  if (!image) {
    throw new Error("Image is Required");
  }
  
  // Validate file type
  if (!image.type.startsWith('image/')) {
    throw new Error("File must be an image");
  }
  
  // Validate file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (image.size > maxSize) {
    throw new Error("Image size must be less than 5MB");
  }
  
  try {
    console.log(`📤 Starting upload for: ${image.name}`);
    const newId = doc(collection(db, `id`)).id;
    const fileExtension = image.name.split('.').pop() || 'jpg';
    const fileName = `${newId}.${fileExtension}`;
    const imageRef = ref(storage, `${folder}/${fileName}`);
    
    console.log(`🔄 Uploading to Firebase Storage: ${folder}/${fileName}`);
    await uploadBytes(imageRef, image);
    
    console.log(`🔗 Getting download URL...`);
    const imageURL = await getDownloadURL(imageRef);
    
    console.log(`✅ Upload successful! URL: ${imageURL}`);
    return imageURL;
  } catch (error) {
    console.error('❌ Error uploading image:', error);
    throw new Error('Failed to upload image. Please try again.');
  }
};

export const createMultipleImageUrls = async ({ images, folder = 'products' }: CreateMultipleImageUrlsParams): Promise<string[]> => {
  if (!images || images.length === 0) {
    throw new Error("At least one image is required");
  }
  
  console.log(`📤 Starting batch upload of ${images.length} images to folder: ${folder}`);
  
  const uploadPromises = images.map((image, index) => {
    console.log(`🔄 Queuing upload ${index + 1}/${images.length}: ${image.name}`);
    return createImageUrl({ image, folder });
  });
  
  try {
    const urls = await Promise.all(uploadPromises);
    console.log(`✅ Batch upload completed! Generated ${urls.length} URLs:`);
    urls.forEach((url, index) => {
      console.log(`   ${index + 1}. ${url}`);
    });
    return urls;
  } catch (error) {
    console.error('❌ Error uploading multiple images:', error);
    throw new Error('Failed to upload one or more images. Please try again.');
  }
};

export const deleteImageFromStorage = async (imageUrl: string): Promise<void> => {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Failed to delete image');
  }
};
