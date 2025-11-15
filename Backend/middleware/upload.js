const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folderName = 'whatsapp/media';
    let resourceType = 'auto';

    if (file.mimetype.startsWith('image/')) {
      folderName = 'whatsapp/images';
      resourceType = 'image';
    } else if (file.mimetype === 'application/pdf') {
      folderName = 'whatsapp/documents';
      resourceType = 'raw';
    } else if (file.mimetype.startsWith('video/')) {
      folderName = 'whatsapp/videos';
      resourceType = 'video';
    } else if (file.mimetype.startsWith('audio/')) {
      folderName = 'whatsapp/audio';
      resourceType = 'video'; // Cloudinary treats audio as "video"
    }

    return {
      folder: folderName,
      resource_type: resourceType,
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'pdf', 'mp4', 'mov', 'mp3', 'wav'],
      public_id: `whatsapp_${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`,
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
});

module.exports = upload;