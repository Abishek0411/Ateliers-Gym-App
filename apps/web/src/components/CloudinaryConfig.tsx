'use client';

import { useEffect } from 'react';

export default function CloudinaryConfig() {
  useEffect(() => {
    // Configure Cloudinary for the client side
    if (typeof window !== 'undefined') {
      // The cloud name is now available via environment variable
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      if (cloudName) {
        console.log('Cloudinary cloud name configured:', cloudName);
      }
    }
  }, []);

  return null; // This component doesn't render anything
}
