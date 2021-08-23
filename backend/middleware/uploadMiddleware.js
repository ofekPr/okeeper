import multer from 'multer'
import jwt from 'jsonwebtoken'
import path from 'path'

const storage = multer.diskStorage({
    destination: 'uploads',
    filename: function (req, file, cb) {
        const token = jwt.sign({user: req.params.userName, date: Date.now(), name: file.originalname}, process.env.JWT_SECRET)
        cb(null, token + path.extname(file.originalname))
    }
});  

// const fileFilter = (req, file, cb) => {
//     if((file.mimetype).includes('jpeg') || (file.mimetype).includes('png') || (file.mimetype).includes('jpg')){
//         cb(null, true);
//     } else{
//         cb(null, false);

//     }

// };

const limits = {
    fileSize: 10000000 // 10000000 Bytes = 10 MB
}

let upload = multer({ storage, limits});

export default upload.single('file')