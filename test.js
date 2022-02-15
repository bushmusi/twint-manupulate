var MongoClient = require('mongodb').MongoClient;  
var url = "mongodb://localhost:27017/test";  
MongoClient.connect(url, function(err, client) {  
    if (err) throw err;  
    let database = client.db('test');
    database.collection('arsenal').find({user_id: {$eq: '1223532723052204032'}}).toArray((err,results)=>{
      if(err) throw err;
      results.forEach(element => {
        console.log(element);  
      });
    })
});  