import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const fileSchema = mongoose.Schema({
    loc: String,
    name : String,
    id: String
})

const pageSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    text: {
        type: String
    },
    file: fileSchema,
    publicEditing: {
        type: Boolean,
        required: true,
        default: false
    },
    publicViewing: {
        type: Boolean,
        required: true,
        default: false
    },
    publicEditing: {
        type: Boolean,
        required: true,
        default: false
    },
    isOneFactorAuthReqForViewing: {
        type: Boolean,
        required: true,
        default: false
    },
})

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    pages: [pageSchema],
}, {
    timestamps: true
})

userSchema.methods.matchPasswords = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema)
const Page = mongoose.model('Page', pageSchema)
const File = mongoose.model('File', fileSchema)

export default User

export {
    Page,
    File
}