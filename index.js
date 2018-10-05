express = require("express");
fs = require("fs");

app = express();

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

app.set('port', process.env.PORT || 8080);

/**
 * Middleware to serve static files from directory
 */
app.use(express.static(__dirname));



app.get('/photo', (req, res) => {
    //res.sendFile(__dirname+"/uploads/photo-1538483960945.png", (err, data)=>{
    data = fs.readFile(__dirname+'/uploads/photo-1538483960945.png', (err, data) => {
        if(err)
            console.log(err);
        
        res.send({
            name: 'tempname',
            data
        });
    })
});





app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.');
});