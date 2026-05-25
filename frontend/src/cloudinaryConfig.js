// Cloudinary configuration - using environment variables
// Create the upload preset in Cloudinary Dashboard > Settings > Upload presets
export const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
};

// Validate configuration
if (!CLOUDINARY_CONFIG.cloudName || !CLOUDINARY_CONFIG.uploadPreset) {
  console.error('[Cloudinary] Configuration is missing.');
  console.error('[Cloudinary] Set VITE_CLOUDINARY_CLOUD_NAME in frontend/.env');
  console.error(
    '[Cloudinary] Set VITE_CLOUDINARY_UPLOAD_PRESET in frontend/.env',
  );
  console.error('[Cloudinary] Restart the dev server after updating envs.');
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
        body: formData,
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[Cloudinary] Error response:', errorData);
      console.error(
        '[Cloudinary] Error message:',
        errorData.error?.message || 'Unknown error',
      );

      if (errorData.error?.message?.includes('preset')) {
        console.error('[Cloudinary] Upload preset not found.');
        console.error(
          '[Cloudinary] Create the preset configured in VITE_CLOUDINARY_UPLOAD_PRESET.',
        );
      }

      throw new Error(errorData.error?.message || 'Upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// Upload multiple images to Cloudinary
export const uploadMultipleToCloudinary = async (files) => {
  try {
    const uploadPromises = files.map((file) => uploadToCloudinary(file));
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Multiple upload error:', error);
    throw error;
  }
};
