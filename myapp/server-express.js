var express = require('express'), app = express()
var redis = require('redis'), client = redis.createClient()
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var AllItems=[],Promotions=[],inputs=[]
client.get("allitems", function (key, value) {
    AllItems=JSON.parse(value)
    console.log(AllItems)
});
client.get("promotions", function (key, value) {
    Promotions=JSON.parse(value)
    console.log(Promotions)
})

app.get('/allitems', function (req, res) {
    res.send(AllItems)
})
app.get('/promotions', function (req, res) {
    res.send(Promotions)
})
app.post('/inputs',function(req,res){
    client.set("inputs",req.body.inputs)
    client.get("inputs",function(key,value){
        inputs=JSON.parse(value)
    })
})
app.get('/inputs',function(req,res){
    res.send(inputs)
})
app.use('/static', express.static(__dirname + '/public'));;

var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})