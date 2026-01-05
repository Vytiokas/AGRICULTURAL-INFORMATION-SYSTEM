// Cloudinary config for image uploads
export const CLOUDINARY_CLOUD_NAME = 'dt6jb0ebe';
export const CLOUDINARY_UPLOAD_PRESET = 'agrolink'; // You need to create this preset
export const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export const uploadImage = async (uri) => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    });
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.error) {
      console.error('Cloudinary error:', data.error);
      return null;
    }

    return data.secure_url;
  } catch (error) {
    console.error('Upload error:', error);
    return null;
  }
};
