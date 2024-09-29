import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'; dotenv.config();
import { uploadFile } from './controller.js'
import multer from 'multer';
import path from 'path';
var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

// set up multer storage engine
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function(req, file, cb) {
    cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize multer Middleware
const upload = multer({ storage: storage}).single('upfile');

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', function(req, res) {
  upload(req, res, function(err) {
    if (err) {
      console.error(err);
      res.send("Error uploading file!");
    }
    console.log(req.file);
    res.json({
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size
    })
  })
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
