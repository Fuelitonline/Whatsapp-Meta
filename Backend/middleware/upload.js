// middleware/upload.js
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Multer: Store file in memory (not disk)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'video/mp4',
      'video/quicktime', // .mov
      'audio/mpeg',
      'audio/wav',
      'audio/mp3',
      'application/pdf'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, videos, audio, and PDF allowed.'), false);
    }
  }
});

// Function to upload buffer to Cloudinary
const uploadToCloudinary = (fileBuffer, originalName, mimetype) => {
  return new Promise((resolve, reject) => {
    const folder =
      mimetype.startsWith('image/') ? 'whatsapp/images' :
        mimetype.startsWith('video/') ? 'whatsapp/videos' :
          mimetype.startsWith('audio/') ? 'whatsapp/audio' :
            'whatsapp/documents';

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'auto',
        public_id: `whatsapp_${Date.now()}_${originalName.replace(/\s+/g, '_')}`.split('.')[0],
        format: mimetype.split('/')[1],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          resource_type: result.resource_type,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
};

module.exports = { upload, uploadToCloudinary };