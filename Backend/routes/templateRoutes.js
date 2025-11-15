const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const {
  saveAndSubmitTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
  syncTemplates,
} = require('../controller/Template/templateController');

const router = express.Router();

router.post('/createTemplate', authMiddleware, upload.single('headerFile'), saveAndSubmitTemplate);
router.get('/getTemplate', authMiddleware, getTemplates);
router.post('/sync', authMiddleware, syncTemplates);
router.get('/getTemplate/:id', authMiddleware, getTemplateById);
router.put('/updateTemplate/:id', authMiddleware, upload.single('headerFile'), updateTemplate);
router.delete('/deleteTemplate/:id', authMiddleware, deleteTemplate);

module.exports = router;