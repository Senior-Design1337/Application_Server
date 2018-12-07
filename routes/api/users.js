const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const Users = mongoose.model('Users');
var admin = require('firebase-admin');
// var re = require('RegExp');

const sharp = require('sharp');

var serviceAccount = require(__dirname + "/sendezproj-firebase-adminsdk-2pq60-2fbb829061.json");

const cp = require("child_process");

fs = require("fs");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sendezproj.firebaseio.com"
});

// Get a database reference to our posts
var db = admin.database();
var ref = db.ref("BCE");
var ref_signup = db.ref("photo_signup");

// const pythonversion = "python3.6"
const pythonversion = "python3"

ref_signup.on("value", snapshot => {

console.log(snapshot.val().id)
// console.log(snapshot.val().photos)

// for(index in snapshot.val().photos){
//   console.log("index: " + snapshot.val().photos[index])
// }


if(snapshot.val().id!=null  && snapshot.val().photos!=null){
    console.log("saving....")
    console.log(snapshot.val())
    dir = __dirname.replace(/\/routes\/api/, '/models/known_people/' + snapshot.val().id)
    
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    // save pictures in models/known_people directory
    for(index in snapshot.val().photos){
      // console.log(dir + "/" + new Date().getTime() * Math.random() + ".png")
      fs.writeFile(dir + "/" + new Date().getTime() * Math.random() + ".png", snapshot.val().photos[index], 'base64', function(err) {
        if(err)
          console.log(err);
      });
    }

    console.log("extracting facial features...")
    // spawn child process to extract facial features then delete files in models/known_people
    const pythonProcess = cp.spawn(pythonversion,[__dirname + '/scripts/add_to_img_pool.py']);
    
    console.log("called script");

    console.log("waiting for output");
    pythonProcess.stdout.on('data', (data) => {
      console.log("printing output...")
      console.log(data.toString());
      // res.write(data);
      // res.end('end');
    });


    // add 1st photo to user's profile
    Users.update({_id: snapshot.val().id}, {
      photo: snapshot.val().photos[0]
    }, function(err, affected, resp) {
     console.log("response" + resp);
    })
    console.log("addeeeed")


  }
  else
    console.log("no photos to add")
      
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });



// Attach an asynchronous callback to read the data at our posts reference
ref.on("value", function(snapshot) {
  console.log("new data!")
  // console.log(snapshot.val());


  console.log("printing facialfeatures...")
  console.log(snapshot.val().FacialFeatures)
  // const pythonProcess = cp.spawn('python3.6',[__dirname + '/scripts/process_picture.py', '[-5.02297580e-02  1.26760080e-01  3.77465747e-02 -2.10738834e-02\n -9.86030772e-02 -3.23209167e-03 -3.80280092e-02 -8.08492303e-02\n  1.28862917e-01 -1.20417327e-01  8.24542195e-02 -1.01172492e-01\n -1.74008071e-01  3.29966657e-02 -3.06838341e-02  1.27440408e-01\n -1.97433874e-01 -6.67174160e-02 -1.28294557e-01 -1.14508331e-01\n  6.80248067e-02  1.14857338e-01 -2.19074786e-02  8.76902044e-03\n -1.70026362e-01 -3.26539963e-01 -9.22631770e-02 -1.50439903e-01\n  5.18140458e-02 -7.32299984e-02 -4.99619544e-02 -4.58791927e-02\n -1.61716744e-01 -1.67583600e-02  6.50386810e-02  2.09987164e-04\n -5.70341274e-02 -5.61766848e-02  8.86950791e-02  3.83684486e-02\n -1.08378172e-01  2.83726454e-02  7.65267909e-02  2.80950844e-01\n  1.24665245e-01  1.15483917e-01 -1.78522021e-02 -1.07932150e-01\n  1.29320234e-01 -2.20598400e-01  1.54873222e-01  7.27170333e-02\n  3.19188982e-02  1.24173850e-01  1.37470573e-01 -1.67170733e-01\n  6.39430881e-02  6.40481412e-02 -2.40873784e-01  1.51794732e-01\n  1.20433882e-01 -1.30222552e-02 -4.13024500e-02  1.78492963e-02\n  2.42216825e-01  1.44766659e-01 -9.55065861e-02 -1.02297872e-01\n  1.43553019e-01 -1.78445071e-01  3.86314467e-03 -5.85360192e-02\n -5.43066412e-02 -1.65239275e-01 -2.25232199e-01  3.68878394e-02\n  5.13320625e-01  2.15302616e-01 -1.89862788e-01 -2.17002872e-02\n -4.64821719e-02 -4.36704159e-02  2.10187718e-01  1.00420259e-01\n -1.06857866e-01 -1.66975409e-02 -2.87751760e-02  1.38402939e-01\n  1.78730458e-01 -4.93616611e-02 -5.98646328e-02  2.49440044e-01\n  3.64733487e-03 -1.65851563e-02  1.36605231e-02 -5.35424501e-02\n -1.84895724e-01 -1.48202106e-02 -9.82353017e-02 -3.83635387e-02\n  6.42992556e-02 -5.82239330e-02 -1.50630325e-02  1.34881467e-01\n -1.34747371e-01  1.91140115e-01  4.59303483e-02 -7.40733445e-02\n -2.92570740e-02  4.87168878e-02 -1.71608478e-01 -3.60082686e-02\n  1.36685371e-01 -2.06164867e-01  2.09368780e-01  1.28074378e-01\n  7.60017484e-02  1.76120102e-01  2.20122114e-02  4.47442606e-02\n  8.90297517e-02 -6.84083998e-03 -1.69876680e-01 -5.69036454e-02\n  7.57844597e-02 -5.72012365e-03  5.06599396e-02  3.85830402e-02]']);
  
  if(snapshot.val().FacialFeatures != null){
    // print('python3.6',__dirname ,'/scripts/process_picture.py')
    const pythonProcess = cp.spawn(pythonversion,[__dirname + '/scripts/process_picture.py', snapshot.val().FacialFeatures]);
    // const pythonProcess = cp.spawn('python3.6',[__dirname + '/scripts/printname.py', snapshot.val().FacialFeatures]);
    
    console.log("called script");

    console.log("waiting for output");
    pythonProcess.stdout.on('data', (data) => {
      console.log("printing output...")
      var id_result = data.toString().replace(/^\s+|\s+$/g, '')
      console.log(id_result); // retrieved ID trimmed of spaces and newlines
      // res.write(data);

      if(id_result == "Unknown" || id_result == null || id_result == undefined){
          //SEND DATA
          // This registration token comes from the client FCM SDKs.
          // var registrationToken = 'cavpQzvnQqM:APA91bE1N5ecoWIt3gB13YVwGH7-2zlnKC2f1oDRoow7v1MPICiJBZ4y1TYwFqSaRiEKSqi4toPDpwOhLSSTohZQyDuIBV-098XOG0jpZRnK6kBLjuytl7xDBwkXZQNeeH-AH3MwOQHF';
          var registrationToken = snapshot.val().Token;
          var w_registrationToken = "dZcyiyC8rhU:APA91bHBsO1rRbUqwIzkrvLgS1UltRsKwJ5m0k_Y5yhqVITCXGE2zvlVwx_eoBprl0msrz9VPBjHNuUibv-e72u2ywK53QMGwzPWgQQFE-eTpXpRDlL1SQinqAMCnhs1k3FCENCgaA_E"
          
          // See documentation on defining a message payload.
          var message = {
            data: {
              // score: '850',
              // time: '2:45'
              // "user": user.toString(),
              'status': "No match found in the database",
              'name': "Unknown",
              'id': "Unknown"

            },
            token: registrationToken
          };
          

          // Send a message to the device corresponding to the provided
          // registration token.
          admin.messaging().send(message)
            .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
          })
          .catch((error) => {
            console.log('Error sending message:', error);
          });

          var message = {
            data: {
              // score: '850',
              // time: '2:45'
              // "user": user.toString(),
              'status': "No match found in the database",
              'name': "Unknown",
              'id': "Unknown"

            },
            token: w_registrationToken
          };
          
          // Send a message to the device corresponding to the provided
          // registration token.
          admin.messaging().send(message)
            .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
          })
          .catch((error) => {
            console.log('Error sending message:', error);
          });


      }
      else{
        Users.findById(id_result, function(error, user) { 
          
          console.log("inside findById")
          console.log(id_result)

          console.log("reeeeeeeeeeeeeee")

          console.log(user)
          if(error){
            console.log(error)
          }
          else if(user == null){
            console.log("no user was found")
          }
          else{
          // return res.json(user);

          //SEND DATA
          // This registration token comes from the client FCM SDKs.
          // var registrationToken = 'cavpQzvnQqM:APA91bE1N5ecoWIt3gB13YVwGH7-2zlnKC2f1oDRoow7v1MPICiJBZ4y1TYwFqSaRiEKSqi4toPDpwOhLSSTohZQyDuIBV-098XOG0jpZRnK6kBLjuytl7xDBwkXZQNeeH-AH3MwOQHF';
          var registrationToken = snapshot.val().Token;
          var w_registrationToken = "dZcyiyC8rhU:APA91bHBsO1rRbUqwIzkrvLgS1UltRsKwJ5m0k_Y5yhqVITCXGE2zvlVwx_eoBprl0msrz9VPBjHNuUibv-e72u2ywK53QMGwzPWgQQFE-eTpXpRDlL1SQinqAMCnhs1k3FCENCgaA_E"
          var w_registrationToken = "eJjkCU_Iu4k:APA91bEZOH5tGgfEYpmbJdNgcKxLLrV17-biAOqGO_QTKEtY_XgbsKCM90NN6qw33nza7P1ERK9BfxTlHEo22vdr01QAnGQFinfEYKSBJ4Gh_akPsOm860xkK5fQWvGhFLcaLnXRZgDs"

          // See documentation on defining a message payload.
          var message = {
            data: {
              // score: '850',
              // time: '2:45'
              // "user": user.toString(),
              'id': user.id,
              'email': user.email,
              'name': user.name,
              // 'photo': user.photo,
              'phone': '04209452',
              'status': "Match Found"
            },
            token: registrationToken
          };
          

          // Send a message to the device corresponding to the provided
          // registration token.
          admin.messaging().send(message)
            .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
          })
          .catch((error) => {
            console.log('Error sending message:', error);
          });

          // //------------------------------------------------------------------
          // var message = {
          //   data: {
          //     // score: '850',
          //     // time: '2:45'
          //     // "user": user.toString(),
          //     'id': "5be97090298f43633d6a3fed",
          //     'email': "asdasd",
          //     'name': "user.name",
          //     'photo': "user.photo",
          //     'phone': '04209452',
          //     'status': "Match Found",

          //   },
          //   token: registrationToken
          // };
          

          // // Send a message to the device corresponding to the provided
          // // registration token.
          // admin.messaging().send(message)
          //   .then((response) => {
          //   // Response is a message ID string.
          //   console.log('Successfully sent message:', response);
          // })
          // .catch((error) => {
          //   console.log('Error sending message:', error);
          // });
          // //-----------------------------------------------------

          var message = {
            data: {
              // score: '850',
              // time: '2:45'
              // "user": user.toString(),
              'id': user.id,
              'email': user.email,
              'name': user.name,
              // 'photo': user.photo,
              'phone': '04209452',
              'status': "Match Found",

            },
            token: w_registrationToken
          };
          

          // Send a message to the device corresponding to the provided
          // registration token.
          admin.messaging().send(message)
            .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
          })
          .catch((error) => {
            console.log('Error sending message:', error);
          });
        }
        })
      
      }
      // res.end();
    });

  }

}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});


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


router.get('/send_compress', (req,res) => {
  ref.once("value", function(snapshot) {

    console.log("saving....")
    // dir = "models/compressed_photo/" + snapshot.val().ID

    // dir = __dirname.replace(regex, 'ferret')
    console.log(__dirname)
    
    dir = __dirname.replace(/\/routes\/api/, '/models/compressed_photo/' + snapshot.val().ID);

    console.log(dir);

    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    console.log(snapshot.val().photo)
    for(index in snapshot.val().photo){
        // console.log(snapshot.val().photo[index])
        console.log(dir + "/" + new Date().getTime() * Math.random() + ".jpg")
        fs.writeFile(dir + "/" + new Date().getTime() * Math.random() + ".jpg", snapshot.val().photo[index], 'base64', function(err) {
          
          if(err)
            console.log(err);

        });
      }

    // res.end()
    
    console.log("printing ")
    fs.readdir(dir, (err, files) => {
      files.forEach(file => {
        console.log(file); // use those file and return it as a REST API

          sharp(dir + '/' + file)
          .resize(32, 24)
          .toFile(dir + "/" + new Date().getTime() * Math.random() + ".jpg", (err, info) => {
            if(err)
              console.log(err)
          } );

        
      });
    })


  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });


  res.end()

})


router.post('/download_img', (req,res) => {

  // id = req.body.id

  Users.findById(req.body.id.toString().replace(/^\s+|\s+$/g, ''), function(error, user) { 
      
    console.log("inside findById")
    console.log(user.photo);
    // console.log(user.id)

    //return the response 
    return res.json(user.photo);
  })

})


router.post('/friendreq', (req, res) => {

  // get array of MACs
  mac_arr = req.body.mac

  function getprofiles(mac) {
    
    Users.find({MAC: mac_arr}, function(error, user) { 
      return [user["title"], user["company"]]
    });
  }


  // Query all MACs and get user profiles
  let titlexcomp = eval(mac_arr).map(getprofiles)   
  titlexcomp = titlexcomp.toString()    // "a,b,c" nor "['a', 'b', 'c']"

  // call .py script to get one ID back
  const pythonProcess = cp.spawn(pythonversion,[__dirname + '/scripts/recommend_friend.py', ]);
    
  console.log("called script");

    
  console.log("waiting for output");
  // send user profile to user
  pythonProcess.stdout.on('data', (data) => {
    console.log("printing output...")
    console.log(data.toString());
    res.write(data);
    res.end('end');
  });
})


//change ref link in here, and application ///// make function an asynchronous trigger
router.get('/save_img', (req, res) => {

  ref.once("value", function(snapshot) {

    console.log("saving....")
    dir = "models/known_people/" + snapshot.val().ID
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    // console.log(snapshot.val().photo)
    for(index in snapshot.val().photo){
        // console.log(snapshot.val().photo[index])
        console.log(dir + "/" + new Date().getTime() * Math.random() + ".png")
        fs.writeFile(dir + "/" + new Date().getTime() * Math.random() + ".png", snapshot.val().photo[index], 'base64', function(err) {
          
          if(err)
            console.log(err);

        });
      }

      res.end()
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

})

router.get('/fb_realtime_data', (req, res) => {
    // Attach an asynchronous callback to read the data at our posts reference
  ref.once("value", function(snapshot) {
    console.log(snapshot.val());
    console.log(snapshot);
    res.send(snapshot.val())
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
})

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
  
  const pythonProcess = cp.spawn(pythonversion,[__dirname + '/scripts/process_picture.py', req.body.facialfeature]);
  
  // const pythonProcess = cp.spawn('python3.6',[__dirname + '/scripts/printname.py']);
  

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
  const pythonProcess = cp.spawn(pythonversion,[__dirname + '/scripts/process_picture.py', '[-0.09166827  0.14425197  0.04078295 -0.03495655 -0.09622052  0.04099583\n  0.02662841 -0.17784461  0.12904914 -0.1388557   0.18857408 -0.02269836\n -0.31221309 -0.10909825  0.05068425  0.11542154 -0.11377509 -0.12412596\n -0.18914004 -0.11264455 -0.02938333  0.04681868 -0.0251527  -0.04514992\n -0.08941696 -0.25926712 -0.10442628 -0.05142256  0.01757953 -0.08665138\n  0.0842521   0.06147777 -0.20893137 -0.08608527 -0.05323231  0.03884585\n -0.05924495 -0.04575182  0.07029408  0.03683743 -0.14352694 -0.04711682\n -0.02806153  0.23502387  0.23772253  0.01743989 -0.00103552 -0.09930864\n  0.09209329 -0.25414282 -0.02423913  0.10893594  0.04156319  0.1021982\n  0.05787547 -0.09143835  0.01682046  0.13410327 -0.16470394  0.0794233\n  0.04785687 -0.2341857  -0.0453307  -0.06419529  0.09106698  0.08091357\n -0.0099361  -0.13200559  0.22118577 -0.18348159 -0.13668175  0.05446102\n -0.06471929 -0.15043966 -0.3472513   0.00623041  0.37149131  0.18573408\n -0.15642616 -0.05463828 -0.04825759 -0.00336403  0.09292394  0.07982755\n  0.0016217  -0.12219425 -0.07368944  0.03052378  0.25506455 -0.07061901\n -0.0461551   0.24331255 -0.03288478 -0.03834173  0.02473532  0.03230941\n -0.05248236 -0.01390602 -0.09815697 -0.06522249  0.06731446 -0.14231357\n  0.00802742  0.08258242 -0.11984105  0.21042551  0.01114251  0.01666296\n -0.00154421 -0.11873214 -0.02308807  0.06714715  0.23481898 -0.16937561\n  0.25159791  0.23491265 -0.06884868  0.13148509  0.03437761  0.12037931\n -0.06310897 -0.08327458 -0.14112675 -0.16643775  0.02053617  0.02646331\n  0.01319711  0.01977976]']);
  

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
  const pythonProcess = cp.spawn(pythonversion,[__dirname + '/scripts/add_to_img_pool.py']);
  
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

// // POST new user route (optional, everyone has access)
// router.post('/signup+', auth.optional, (req, res, next) => {
//   const { body: { user } } = req;

//   if(!user.email) {
//     return res.status(422).json({
//       errors: {
//         email: 'is required',
//       },
//     });
//   }

//   if(!user.password) {
//     return res.status(422).json({
//       errors: {
//         password: 'is required',
//       },
//     });
//   }

//   if(!user.name) {
//     return res.status(422).json({
//       errors: {
//         name: 'is required',
//       },
//     });
//   }

//   if(!user.photo) {
//     return res.status(422).json({
//       errors: {
//         photo: 'is required',
//       },
//     });
//   }

//   //store the photo as a string in mongo
//   user.photo = JSON.stringify(new Buffer(user.photo).toString('base64'))

//   const finalUser = new Users(user);

//   finalUser.setPassword(user.password);

//   return finalUser.save()
//     .then(() => res.json({ user: finalUser.toAuthJSON() }));
// });

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