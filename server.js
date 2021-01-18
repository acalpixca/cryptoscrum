var express    =    require('express');
var app        =    express();

require('./router/main')(app);

app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);


app.use(express.static(__dirname + '/public'));
// app.use(express.static('public'));
// to implement bootstrap
/*app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
*/
// fin

/*app.get('/',function(req,res){
    res.send('Hello world');
}); */

var port = process.env.PORT || 3000;
var server     =    app.listen(port,function(){
    console.log("We have started our server on port 3000");
});