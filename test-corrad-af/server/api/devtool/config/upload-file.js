import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  if (method !== "POST") {
    return {
      statusCode: 405,
      message: "Method not allowed",
    };
  }

  try {
    const form = await readMultipartFormData(event);
    
    if (!form || form.length === 0) {
      return {
        statusCode: 400,
        message: "No file uploaded",
      };
    }

    const file = form[0];
    const fileType = form.find(field => field.name === 'type')?.data?.toString() || 'logo';
    
    // Validate file type
    const allowedTypes = {
      logo: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'],
      'loading-logo': ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'],
      'login-logo': ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'],
      favicon: ['image/x-icon', 'image/vnd.microsoft.icon', 'image/png'],
      'og-image': ['image/jpeg', 'image/jpg', 'image/png'],
      theme: ['text/css', 'application/octet-stream']
    };

    if (!allowedTypes[fileType] || !allowedTypes[fileType].includes(file.type)) {
      return {
        statusCode: 400,
        message: `Invalid file type for ${fileType}. Allowed types: ${allowedTypes[fileType].join(', ')}`,
      };
    }

    let uploadDir, fileUrl;
    
    // Determine upload directory based on file type
    if (fileType === 'theme') {
      // Theme files go to assets/style/css
      uploadDir = path.join(process.cwd(), 'assets', 'style', 'css');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      // Generate unique filename for theme
      const fileExtension = path.extname(file.filename || '');
      const uniqueFilename = `custom-theme-${uuidv4()}${fileExtension}`;
      const filePath = path.join(uploadDir, uniqueFilename);
      
      // Save file
      fs.writeFileSync(filePath, file.data);
      
      // Return relative path for theme files
      fileUrl = `/assets/style/css/${uniqueFilename}`;
    } else {
      // Logo, loading-logo, favicon, and og-image files go to public/uploads
      uploadDir = path.join(process.cwd(), 'public', 'uploads', 'site-settings');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileExtension = path.extname(file.filename || '');
      let baseFilename;

      switch (fileType) {
        case 'logo':
          baseFilename = 'site-logo';
          break;
        case 'loading-logo':
          baseFilename = 'loading-logo';
          break;
        case 'login-logo':
          baseFilename = 'login-logo';
          break;
        case 'favicon':
          baseFilename = 'favicon';
          break;
        case 'og-image':
          baseFilename = 'og-image';
          break;
        default:
          // This case should ideally not be reached if fileType is validated earlier
          // and is one of the image types.
          // However, as a fallback, use the fileType itself or a generic name.
          // For safety, and to avoid using uuidv4 for these specific types as requested,
          // we should ensure this path isn't taken for the specified image types.
          // If an unexpected fileType gets here, it might be better to error or use a UUID.
          // For now, we'll stick to the primary requirement of fixed names for specified types.
          // If we need UUID for other non-logo image types, that logic can be added.
          // console.warn(`Unexpected fileType received: ${fileType} for non-theme upload.`);
          // For simplicity, if it's an image type not explicitly handled, it will get a name like 'unknown-type.ext'
          baseFilename = fileType; 
      }
      
      const filenameWithExt = `${baseFilename}${fileExtension}`;
      const filePath = path.join(uploadDir, filenameWithExt);

      // Save file (overwrites if exists)
      fs.writeFileSync(filePath, file.data);

      // Return file URL
      fileUrl = `/uploads/site-settings/${filenameWithExt}`;
    }

    return {
      statusCode: 200,
      message: "File uploaded successfully",
      data: {
        filename: path.basename(fileUrl),
        url: fileUrl,
        type: fileType,
        size: file.data.length,
      },
    };

  } catch (error) {
    console.error("Upload error:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
}); 