import multer from "multer";
import path from "path"

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    const withoutExt = path.basename(file.originalname, ext)
    cb(null, withoutExt + '-' + uniqueSuffix + '-' + ext)
  }
})

const fileFilter = (req, file, cb) => {
    const allowedMimesTypes = ["image/jpeg", "image/jpg", "image/png"]

    const ext = path.extname(file.originalname).toLocaleLowerCase()
    const allowedExt = [".jpeg", ".jpg", ".png"]

    const isMimeTypeValid = allowedMimesTypes.includes(file.mimetype)
    const isExtensionValid = allowedExt.includes(ext)
    if (isMimeTypeValid &&  isExtensionValid) {
        cb(null, true)
    } else {
        if (!isMimeTypeValid) {
            cb(new Error("File harus berupa gambar JPG atau PNG"), false)
        } else {
        cb(new Error("File extension tidak valid"), false)
        }}
}

const upload = multer ({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1
    }
})

export default upload