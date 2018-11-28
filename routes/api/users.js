const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const Users = mongoose.model('Users');

const cp = require("child_process");

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

// request json by sending User ID
router.get('/dbdatabyid', (req, res) => {
  Users.findById("5be97090298f43633d6a3fed", function(error, user) { 
    console.log(user);
    
    return res.json(user);
  })
})

// request json by sending face encoding
router.post('/face_search', (req, res, next) => {

  //create a date object to time the script
  var timing_date = new Date();

  console.log(req.body.facialfeature)
  
  //script call
  const pythonProcess = cp.spawn('python3',[__dirname + '/scripts/process_picture.py', req.body.facialfeature]);
  
  //storing time of script 
  var script_called_time = timing_date.getTime();
  var script_completed_time;
  var response_sent_time;

  
  console.log("called script");

  console.log("waiting for output");
  pythonProcess.stdout.on('data', (data) => {

    //upon script completion log time again
    script_completed_time = timing_date.getTime();


    console.log("printing output...")
    console.log(data.toString().replace(/^\s+|\s+$/g, '')); // retrieved ID trimmed of spaces and newlines
    // res.write(data);
    Users.findById(data.toString().replace(/^\s+|\s+$/g, ''), function(error, user) { 
      
      console.log("inside findById")
      console.log(user);

      //print the timing markers
      console.log("Time taken to complete script: " + (script_completed_time-script_called_time));
      response_sent_time = timing_date.getTime();
      console.log("Time taken to send the response: " + (response_sent_time-script_called_time));

      //return the response 
      return res.json(user);
    })
    // res.end();
  });
})

// request user name by sending user ID

router.get('/callscript', (req, res) => {
  ///DEPRECATED FUNCTION
  console.log("got request");
  console.log("finsihed requiring");
  const pythonProcess = cp.spawn('python3.6',[__dirname + '/scripts/process_picture.py', '[-0.09166827  0.14425197  0.04078295 -0.03495655 -0.09622052  0.04099583\n  0.02662841 -0.17784461  0.12904914 -0.1388557   0.18857408 -0.02269836\n -0.31221309 -0.10909825  0.05068425  0.11542154 -0.11377509 -0.12412596\n -0.18914004 -0.11264455 -0.02938333  0.04681868 -0.0251527  -0.04514992\n -0.08941696 -0.25926712 -0.10442628 -0.05142256  0.01757953 -0.08665138\n  0.0842521   0.06147777 -0.20893137 -0.08608527 -0.05323231  0.03884585\n -0.05924495 -0.04575182  0.07029408  0.03683743 -0.14352694 -0.04711682\n -0.02806153  0.23502387  0.23772253  0.01743989 -0.00103552 -0.09930864\n  0.09209329 -0.25414282 -0.02423913  0.10893594  0.04156319  0.1021982\n  0.05787547 -0.09143835  0.01682046  0.13410327 -0.16470394  0.0794233\n  0.04785687 -0.2341857  -0.0453307  -0.06419529  0.09106698  0.08091357\n -0.0099361  -0.13200559  0.22118577 -0.18348159 -0.13668175  0.05446102\n -0.06471929 -0.15043966 -0.3472513   0.00623041  0.37149131  0.18573408\n -0.15642616 -0.05463828 -0.04825759 -0.00336403  0.09292394  0.07982755\n  0.0016217  -0.12219425 -0.07368944  0.03052378  0.25506455 -0.07061901\n -0.0461551   0.24331255 -0.03288478 -0.03834173  0.02473532  0.03230941\n -0.05248236 -0.01390602 -0.09815697 -0.06522249  0.06731446 -0.14231357\n  0.00802742  0.08258242 -0.11984105  0.21042551  0.01114251  0.01666296\n -0.00154421 -0.11873214 -0.02308807  0.06714715  0.23481898 -0.16937561\n  0.25159791  0.23491265 -0.06884868  0.13148509  0.03437761  0.12037931\n -0.06310897 -0.08327458 -0.14112675 -0.16643775  0.02053617  0.02646331\n  0.01319711  0.01977976]']);
  

  console.log("called script");

  console.log("waiting for output");
  pythonProcess.stdout.on('data', (data) => {
    console.log("printing output...")
    console.log(data.toString());
    res.write(data);
    res.end('end');
  });
  console.log("got output");
})

router.get('/adduserimg', (req, res) => {

  console.log("got request");
  console.log("finsihed requiring");
  const pythonProcess = cp.spawn('python3.6',[__dirname + '/scripts/add_to_img_pool.py']);
  
  console.log("called script");

  console.log("waiting for output");
  pythonProcess.stdout.on('data', (data) => {
    console.log("printing output...")
    console.log(data.toString());
    res.write(data);
    res.end('end');
  });
  console.log("got output");

})

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

  

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
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