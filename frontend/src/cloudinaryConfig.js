// Cloudinary configuration - using environment variables
// Upload preset 'farmers_preset' must be created in Cloudinary dashboard (Settings > Upload > Upload presets)
export const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'YOUR_CLOUD_NAME',
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || '741568897314964',
  uploadPreset: 'farmers_preset' // Hardcoded - create this in Cloudinary dashboard
};

// Validate configuration
if (!CLOUDINARY_CONFIG.cloudName || CLOUDINARY_CONFIG.cloudName === 'YOUR_CLOUD_NAME') {
  console.error('❌ Cloudinary Cloud Name NOT SET!');
  console.error('👉 Go to: https://cloudinary.com/console');
  console.error('👉 Copy your Cloud Name from the dashboard');
  console.error('👉 Update VITE_CLOUDINARY_CLOUD_NAME in frontend/.env file');
  console.error('👉 Restart the dev server');
}

// Upload image to Cloudinary
export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
  
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Cloudinary Error Response:', errorData);
      console.error('🔴 Error Message:', errorData.error?.message || 'Unknown error');
      
      if (errorData.error?.message?.includes('preset')) {
        console.error('');
        console.error('⚠️  UPLOAD PRESET NOT FOUND!');
        console.error('👉 Go to: https://console.cloudinary.com/console/dgfpyihjt/settings/upload');
        console.error('👉 Scroll to "Upload presets" section');
        console.error('👉 Click "Add upload preset"');
        console.error('👉 Name: farmers_preset');
        console.error('👉 Signing Mode: Unsigned');
        console.error('👉 Click Save');
        console.error('');
      }
      
      throw new Error(errorData.error?.message || 'Upload failed');
    }
    
    const data = await response.json();
    return data.secure_url; // Returns the image URL
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// Upload multiple images to Cloudinary
export const uploadMultipleToCloudinary = async (files) => {
  try {
    const uploadPromises = files.map(file => uploadToCloudinary(file));
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Multiple upload error:', error);
    throw error;
  }
};
