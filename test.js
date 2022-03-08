const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017/test';
MongoClient.connect(url, (err, client) => {
  if (err) throw err;
  const database = client.db('test');
  database.collection('arsenal').find({ user_id: { $eq: '1223532723052204032' } }).toArray((err, results) => {
    if (err) throw err;
    results.forEach((element) => {
      console.log(element);
    });
  });
});