const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const Users = mongoose.model('Users');
fs = require("fs");

function serveStaticFile (res, path , contentType , responseCode ) {
  if (!responseCode) responseCode = 200 ;
  fs.readFile (__dirname +'/public'+path, function (err,data) {
  if (err)
  {
      res.writeHead ( 500 , { 'Content-Tye' : 'text/plain' });
      res.end ( '500 - Internal Error' );
  }
  else
  {
      res.writeHead ( responseCode , { 'Content-Type' : contentType });
      res.end (data);
  }
  });
}

//test Model_Ouput.JSON
router.get('/model_data', (req, res) => {
  res.sendFile(__dirname+'/test_models/model_output.JSON', (err, data)=>{
  // data = fs.readFile(__dirname+'/models/model_output.JSON', (err, data) => {
      if(err)
          console.log(err);
      
  //     res.send(data);
  })
});

//POST new user route (optional, everyone has access)
router.post('/signup+', auth.optional, (req, res, next) => {
  const { body: { user } } = req;

  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  if(!user.name) {
    return res.status(422).json({
      errors: {
        name: 'is required',
      },
    });
  }

  if(!user.photo) {
    return res.status(422).json({
      errors: {
        photo: 'is required',
      },
    });
  }

  //store the photo as a string in mongo
  user.photo = JSON.stringify(new Buffer(user.photo).toString('base64'))

  const finalUser = new Users(user);

  finalUser.setPassword(user.password);

  return finalUser.save()
    .then(() => res.json({ user: finalUser.toAuthJSON() }));
});

//POST new user route (optional, everyone has access)
router.post('/signup', auth.optional, (req, res, next) => {
  const { body: { user } } = req;

  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  if(!user.name) {
    return res.status(422).json({
      errors: {
        name: 'is required',
      },
    });
  }

  const finalUser = new Users(user);

  finalUser.setPassword(user.password);

  return finalUser.save()
    .then(() => res.json({ user: finalUser.toAuthJSON() }));
});


router.post('/sendPhoto', auth.optional, (req, res, next) => {
  // const { body: { photo } } = req;


  if(!req.body.photo) {
    return res.status(422).json({
      errors: {
        photo: 'is required',
      },
    });
  }


  // console.log(req.body.photo.data);

  const finalUser = new Users({user:{name: req.body.name, photo: new Buffer(req.body.photo).toString('base64')}});


  return finalUser.save()
    .then(() => res.json({ user: finalUser.toAuthJSON() }));

});

//POST login route (optional, everyone has access)
router.post('/login', auth.optional, (req, res, next) => {
  const { body: { user } } = req;

  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  /*
  if(!user.name) {
    return res.status(422).json({
      errors: {
        name: 'is required',
      },
    });
  }

  */

  return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
    if(err) {
      return next(err);
    }

    if(passportUser) {
      const user = passportUser;
      user.token = passportUser.generateJWT();

      return res.json({ user: user.toAuthJSON() });
    }

    return status(400).info;
  })(req, res, next);
});

//GET current route (required, only authenticated users have access)
router.get('/current', auth.required, (req, res, next) => {
  const { payload: { id } } = req;

  return Users.findById(id)
    .then((user) => {
      if(!user) {
        return res.sendStatus(400);
      }

      return res.json({ user: user.toAuthJSON() });
    });
});

module.exports = router;