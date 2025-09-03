// import multer from "multer";
// import path from "path";
// import fs from 'fs';

// const uploadDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");  // ensure this folder exists
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const fileFilter = (req: any, file: any, cb: any) => {
//   const fileTypes = /jpeg|jpg|png/;
//   const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
//   if (extname) return cb(null, true);
//   cb(new Error("Only images are allowed"));
// };

// const upload = multer({ storage, fileFilter });

// export default upload;



import multer from "multer";
import path from "path";
import fs from 'fs';

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);  // use full path here
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif|jfif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    console.error(`Rejected file: ${file.originalname} (${file.mimetype})`);
    cb(new Error("Only images are allowed (jpg, jpeg, png, webp, gif)"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  }
});

export default upload;

