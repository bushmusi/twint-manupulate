const { json } = require('express');
var express = require('express');
var app = express();

app.get('/welcome',function(req,res){
  msg = {
    "Name": 'Bushra ',
    "Age": 23
  }
  res.send(msg)
})

var server = app.listen(8000,function(){
  console.log("Test Server is running");
})