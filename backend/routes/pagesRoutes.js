import express from 'express'
const router = express.Router()
import { getPublicPages, getAllPages, getPageById, getAnyPageById, createNewPage, deletePage, deleteAnyPage, updatePage, updateAnyPage, sendPublicEditingEmail, getPageFile } from '../controllers/pageController.js'
import { protect } from '../middleware/authMiddleware.js'
import { uploadFile } from '../controllers/pageController.js'
import upload from '../middleware/uploadMiddleware.js'

router.post('/:userName/api/fileUpload', upload, protect, uploadFile);

router.get('/uploads/:id', getPageFile)

router.route(`/:userName/api/pages`).get(getPublicPages)

router.route(`/:userName/api/pages/all`).get(protect, getAllPages)

router.route(`/:userName/api/pages/:id`).get(getPageById)

router.route(`/:userName/api/pages/:id/any`).get(protect, getAnyPageById)

router.route('/:userName/api/pages/new').post(protect, createNewPage)

router.route('/:userName/api/pages/delete').delete(deletePage)

router.route('/:userName/api/pages/delete/any').delete(protect, deleteAnyPage)

router.route('/:userName/api/pages/edit').put(updatePage)

router.route('/:userName/api/pages/edit/any').put(protect, updateAnyPage)

router.route('/:userName/api/pages/:id/email').get(sendPublicEditingEmail)

export default router