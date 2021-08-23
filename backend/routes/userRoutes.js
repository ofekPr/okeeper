import express from 'express'
const router = express.Router()
import { authUser, getUserProfile, registerUser, updateUserProfile } from '../controllers/userController.js'
import { protect } from '../middleware/authMiddleware.js'

router.route(`/api/user`).post(registerUser)
router.post(`/api/user/login`, authUser)
router.route(`/:userName/api/user/profile`).get(protect, getUserProfile).put(protect, updateUserProfile)


export default router