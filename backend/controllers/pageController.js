import asyncHandler from 'express-async-handler'
import User, { Page, File } from '../models/userModel.js'
import nodemailer from 'nodemailer'
import generateCode from '../utils/generateCode.js'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Fetch all public user pages
// @route   GET /:userName/api/pages
// @access  Public
const getPublicPages = asyncHandler(async (req, res) => {
    const user = await User.findOne({ userName: req.params.userName })

    if (user && user.pages) {
        let pages = user.pages

        pages = pages.filter(page => {
            return page.publicViewing == true
        })

        res.json(pages)
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc    Fetch all user pages
// @route   GET /:userName/api/pages/all
// @access  Privet
const getAllPages = asyncHandler(async (req, res) => {
    const user = await User.findOne({ userName: req.params.userName })

    if (user && user.pages) {
        let pages = user.pages

        res.json(pages)
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc    Fetch single user page
// @route   GET /:userName/api/pages/:id
// @access  Public
const getPageById = asyncHandler(async (req, res) => {
    const user = await User.findOne({ userName: req.params.userName })

    if (user && user.pages) {
        const page = user.pages.find(page => page._id == req.params.id)

        if(page && page.publicViewing == true) {
            res.json(page)
        } else {
            res.status(404)
            throw new Error('Page not found')
        }
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc    Fetch any single user page
// @route   GET /:userName/api/pages/:id/any
// @access  Privet
const getAnyPageById = asyncHandler(async (req, res) => {
    const user = await User.findOne({ userName: req.params.userName })

    if (user && user.pages) {
        const page = user.pages.find(page => page._id == req.params.id)

        if(page) {
            res.json(page)
        } else {
            res.status(404)
            throw new Error('Page not found')
        }
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc    Get public page file
// @route   GET /uploads/:id
// @access  Public
const getPageFile = async (req, res) => {
    let id = req.params.id;

    id = id.split(path.extname(id))[0]

    const decoded = jwt.verify(id, process.env.JWT_SECRET)

    const user = await User.findOne({ userName: decoded.user})

    if (user) {
        const page = user.pages && user.pages.find(page => page.file && page.file.id === id && page.publicViewing)

        if(page) {
            res.sendFile(path.join(__dirname, '../../', page.file.loc.split(process.env.PORT)[1]))
        } else {
            res.status(404)
            throw new Error('File not found')
        }
    } else {
        res.status(404)
        throw new Error('User not found')
    }
}

// @desc    Upload a new File
// @route   POST /:userName/api/fileUpload
// @access  Privet
const uploadFile = async (req, res) => {
    const id = req.params.id;

    const filePath = req.file.path.replace(/\\/g, "/")

    res.json({fileURL: 'http://localhost:5000/' + filePath, fileID: filePath.split(path.extname(filePath))[0].slice(8)});
}

// @desc    Create a new page
// @route   POST /:userName/api/pages/new
// @access  Privet
const createNewPage = asyncHandler(async (req, res) => {
    const user = await User.findOne({ userName: req.params.userName })

    if (user) {
        const page = user.pages && user.pages.find(page => page.name == req.body.name)
        if (!page) {
            let file

            if (req.body.file) {
                file = await File.create({
                    loc: req.body.file.loc,
                    name: req.body.file.name,
                    id: req.body.file.id
                })
            }

            const newPage = await Page.create({ 
                name: req.body.name,
                text: req.body.text,
                file: file ? file : null,
                publicEditing: req.body.publicEditing,
                publicViewing: req.body.publicViewing,
                isOneFactorAuthReqForViewing: req.body.isOneFactorAuthReqForViewing,
            })

            user.pages.push(newPage)
            
            await user.save()

            res.status(201).json(page)
        } else {
            res.status(400)
            throw new Error('Page already exists')
        }
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc    Delete a single page
// @route   DELETE /:userName/api/pages/delete
// @access  Public
const deletePage = asyncHandler(async (req, res) => {
    const user = await User.findOne({ userName: req.params.userName })

    if (user && user.pages) {
        const page = user.pages.find(page => (page.name == req.body.name && page.publicEditing))
        if (page) {
            if(page.file && page.file.loc) {
                const filePath = path.join(__dirname, '../../', page.file.loc.split(process.env.PORT)[1])
                console.log(imagePath)
                await fs.unlinkSync(filePath)
            }

            user.pages.pull(page._id)
            
            await user.save()

            res.status(200).json({ success: true })
        } else {
            res.status(404)
            throw new Error('Page not found')
        }
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc    Delete any single page
// @route   DELETE /:userName/api/pages/delete/any
// @access  Privet
const deleteAnyPage = asyncHandler(async (req, res) => {
    const user = await User.findOne({ userName: req.params.userName })

    if (user && user.pages) {
        const page = user.pages.find(page => page.name == req.body.name)
        if (page) {
            if(page.file && page.file.loc) {
                const filePath = path.join(__dirname, '../../', page.file.loc.split(process.env.PORT)[1])
                await fs.unlinkSync(filePath)
            }

            user.pages.pull(page._id)
            
            await user.save()

            res.status(200).json({ success: true })
        } else {
            res.status(404)
            throw new Error('Page not found')
        }
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc    Update a page 
// @route   PUT /:userName/api/pages/edit
// @access  Public
const updatePage = asyncHandler(async (req, res) => {
    const user = await User.findOne({ userName: req.params.userName })

    if (user && user.pages) {
        const page = user.pages.find(page => (page._id == req.body._id && page.publicEditing))
        if (page) {
            page.name = req.body.name == null ? page.name : req.body.name
            page.text = req.body.text == null ? page.text : req.body.text
            page.files = req.body.files == null ? page.files : req.body.files
            page.publicViewing = req.body.publicViewing == null ? page.publicViewing : req.body.publicViewing
            page.publicEditing = req.body.publicEditing == null ? page.publicEditing : req.body.publicEditing
            page.isOneFactorAuthReqForViewing = req.body.isOneFactorAuthReqForViewing == null ? page.isOneFactorAuthReqForViewing : req.body.isOneFactorAuthReqForViewing

            await user.save()

            res.status(200).json({
                name: page.name,
                text: page.text,
                files: page.files,
                publicEditing: page.publicEditing,
                publicViewing: page.publicViewing,
                isOneFactorAuthReqForViewing: page.isOneFactorAuthReqForViewing,
            })
        } else {
            res.status(404)
            throw new Error('Page not found')
        }
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc    Update any single page 
// @route   PUT /:userName/api/pages/edit/any
// @access  Privet
const updateAnyPage = asyncHandler(async (req, res) => {
    const user = await User.findOne({ userName: req.params.userName })

    if (user && user.pages) {    
        const page = user.pages.find(page => page._id == req.body._id)

        if (page) {
            page.name = req.body.name == null ? page.name : req.body.name
            page.text = req.body.text == null ? page.text : req.body.text
            page.files = req.body.files == null ? page.files : req.body.files
            page.publicViewing = req.body.publicViewing == null ? page.publicViewing : req.body.publicViewing
            page.publicEditing = req.body.publicEditing == null ? page.publicEditing : req.body.publicEditing
            page.isOneFactorAuthReqForViewing = req.body.isOneFactorAuthReqForViewing == null ? page.isOneFactorAuthReqForViewing : req.body.isOneFactorAuthReqForViewing

            await user.save()

            res.status(200).json({
                name: page.name,
                text: page.text,
                files: page.files,
                publicEditing: page.publicEditing,
                publicViewing: page.publicViewing,
                isOneFactorAuthReqForViewing: page.isOneFactorAuthReqForViewing,
            })
        } else {
            res.status(404)
            throw new Error('Page not found')
        }
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc    Send an email for public editing
// @route   GET /:userName/api/pages/:id/email
// @access  Public
const sendPublicEditingEmail = asyncHandler(async (req, res) => {
    const user = await User.findOne({ userName: req.params.userName })

    if (user && user.pages) {
        let pages = user.pages

        const page = pages.find(page => {
            return page.publicEditing && page._id == req.params.id
        })

        if (page) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: process.env.GMAIL_ADDRESS,
                  pass: process.env.GMAIL_PASSWORD
                }
            });

            const code = generateCode(6)
              
            const mailOptions = {
                from: 'okeeper123@gmail.com',
                to: user.email,
                subject: 'Public Editing',
                html: `
                    <p>Hello ${user.userName},</p>
                    <p>Your code is ${code}. Enter it in the app in order to edit your page.</p>
                    <p>Thanks.</p>
                `
            };
              
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    res.status(400)
                } else {
                    bcrypt.hash(code, 10).then((hash) => {
                        res.status(200).send(hash)
                    })
                }
            })
        }
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

export {
    getAllPages, 
    getPublicPages,
    getPageById,
    getAnyPageById,
    createNewPage,
    deletePage,
    deleteAnyPage,
    updatePage,
    updateAnyPage,
    sendPublicEditingEmail,
    uploadFile,
    getPageFile
}