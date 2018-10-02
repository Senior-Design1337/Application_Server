const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('errorhandler');
const multer = require('multer');
const crypto = require('crypto');


//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

//Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production';

//Initiate our app
const app = express();

var upload = multer({ dest: '/tmp/'});

//Configure our app
app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ 
  extended: true, 
  limit: '50mb',
  parameterLimit: 99999999999
}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'passport-tutorial', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

if(!isProduction) {
  app.use(errorHandler());
}

//Configure Mongoose
mongoose.connect('mongodb://localhost/passport-tutorial');
mongoose.set('debug', true);

//Models & routes
require('./models/Users');
require('./config/passport');
app.use(require('./routes'));

// storage = multer.diskStorage {
//   destination: './uploads',
//   filename: (req, file, cb) ->
//     {crypto.pseudoRandomBytes 16, (err, raw) -> {
//       return cb(err) if err
//       cb(null, "#{raw.toString 'hex'}#{path.extname file.originalname}")}}
// }

// app.post('/', multer({ storage: storage}).single('upload'), (req, res) -> {
//     console.log(req.file)
//     console.log(req.body)
//     res.status(204).end()
// });


// // File input field name is simply 'file'
// app.post('/sendPhoto', upload.single('file'), function(req, res) {
//   var file = __dirname + '/' + req.file.filename;
//   fs.rename(req.file.path, file, function(err) {
//     if (err) {
//       console.log(err);
//       res.send(500);
//     } else {
//       res.json({
//         message: 'File uploaded successfully',
//         filename: req.file.filename
//       });
//     }
//   });
// });


/*Configure the multer for multipart/form-data*/
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    // Rename uploaded file
    cb(null, file.fieldname + '-' + Date.now())
  }
})

var upload = multer({storage: storage});

app.post('/sendPhoto', upload.single('photo'), function (req, res, next) {
    console.log(req.headers);
    console.log(req.files);
    res.send('Hello POST IMG');
})







//Error handlers & middlewares
if(!isProduction) {
  app.use((err, req, res) => {
    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}

app.use((err, req, res) => {
  res.status(err.status || 500);

  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});

app.listen(8000, () => console.log('Server running on http://localhost:8000/'));