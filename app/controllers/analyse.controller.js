const { emit } = require('nodemon');
const { MongoClient } = require('mongodb');
const cli = require('nodemon/lib/cli');
const db = require('../models/index.js');

const url = 'mongodb://localhost:27017/';

exports.dbGetTable = (req, res) => {
  const resList = [];

  MongoClient.connect(url, (err, client) => {
    if (err) throw err;

    const { tableName, params, dbName: databaseName } = req.body;
    const database = client.db(databaseName);

    const queryParam = {};
    Object.entries(params).forEach((value) => {
      const [key, val] = value;
      queryParam[key] = val;
    });
    database.collection(tableName).find(
      queryParam,
    ).toArray((err, results) => {
      if (err) throw err;

      results.forEach((element) => {
        const obj = {};
        obj.user_id = element.user_id;
        obj.name = element.name;
        obj.username = element.username;
        resList.push(obj);
      });

      res.send({
        Result: resList,
      });
    });
  });
};

exports.mapReduceTable = (req, res) => {
  MongoClient.connect(url, (err, client) => {
    if (err) throw err;

    const { tableName, dbName: databaseName } = req.body;
    const database = client.db(databaseName);
    const mapCount = function () { /* eslint-disable */
      emit(this.username, this.likes_count);
    };

    const reduceCount = function (k,v) {
      return Array.sum(v);
    }

    const optParam =       {
      query: {
        $and:
        [
          {likes_count: { $gt: 500 }},
          {date: '2021-12-31'}
        ]
      },
      out: { inline: 1 },
    };

    database.collection(tableName).mapReduce(/* eslint-disable */
      mapCount,
      reduceCount,
      optParam,
      (err, result) => {
        result ? res.send(result) : res.send(err)
      },
    );
  });
};

exports.twintFilter = (req, res) => {
  const resList = [];

  MongoClient.connect(url, (err, client) => {
    if (err) throw err;

    const { dbName, tableName } = req.body;
    const database = client.db(dbName);

    database.collection(tableName).find({
      hashtags: { $in: ['arsenal'] },
    }).toArray((err, result) => {
      if (err) throw err;

      result.forEach((value) => {
        const tweeItem = {
          id: value.id,
          user_id: value.user_id,
          username: value.username,
          name: value.name,
          tweet: value.tweet,
          likes_count: value.likes_count,
          hashtags: value.hashtags,
        };
        resList.push(tweeItem);
      });

      res.send({
        data: resList,
      });
    });
  });
};

exports.dbMetadata =async (req, res) => {
  const { dbName } = req.body;
  const client =new MongoClient(url);
  await client.connect();
  const db = client.db(dbName);
  
  db.listCollections().toArray(async (err,sol) => {
    if(sol){
      let tableData =sol.map(async val => {
        const count =await db.collection(val.name).countDocuments();
        const obj = {
          name: val.name,
          count: count
        };
        return obj;
      });
      Promise.all(tableData).then( result => res.send(result));
    }
  })
};