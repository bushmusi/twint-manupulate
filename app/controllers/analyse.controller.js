const { emit } = require('nodemon');
const { MongoClient } = require('mongodb');
const db = require('../models/index.js');

const url = 'mongodb://localhost:27017/';

exports.dbGetTable = (req, res) => {
  const resList = [];

  MongoClient.connect(url, (err, client) => {
    if (err) throw err;

    const database = client.db('test');
    const [tableName, params] = [req.body.tableName, req.body.params];
    const queryParam = {};
    for (const [key, value] of Object.entries(params)) {
      queryParam[key] = value;
    }

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
        'Query Data': resList,
      });
    });
  });
};

exports.mapReduceTable = (req, res) => {
  MongoClient.connect(url, (err, client) => {
    if (err) throw err;

    const database = client.db('twint');
    const { tableName } = req.body;
    const { query } = req.body;
    const map = emit(this.username, this.likes_count);

    database.collection(tableName).mapReduce(
      function () {
        emit(this.username, this.likes_count);
      },
      (k, v) => Array.sum(v),
      {
        query: {
          likes_count: { $gt: 500 },
        },
        out: { inline: 1 },
      },
      (err, result) => {
        if (result) {
          res.send({
            result,
          });
        }
      },
    );
  });
};

exports.twintFilter = (req, res) => {
  const resList = [];
  MongoClient.connect(url, (err, client) => {
    if (err) throw err;
    const { dbName } = req.body;
    const database = client.db(dbName);
    const { tableName } = req.body;
    console.log(tableName);

    database.collection(tableName).find({
      hashtags: { $in: ['arsenal'] },
    }).toArray((err, result) => {
      if (err) throw err;
      result.forEach((value, index) => {
        const tweeItem = {
          id: value._id,
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

exports.dbMetadata = (req, res) => {
  const { dbName } = req.body;
  MongoClient.connect(url, (err, client) => {
    if (err) throw err;

    const database = client.db(dbName);
    database.listCollections().toArray(async (info, nameList) => {
      const strListNew = nameList.map(async (val) => {
        const collName = val.name;

        const resObj = {
          name: collName,
          type: val.type,
          count: 0,
        };

        const count = database.collection(collName).estimatedDocumentCount();
        // console.log(await count.then((res) => res));
        resObj.count = await count.then((res) => res);
        // console.log(resObj);
        return resObj;
      });
      // console.log(await strListNew[0].then((res) => res));

      res.send({
        'db-name': dbName,
        'number of collection': strListNew.length,
        'collection list: ': strListNew,
      });
    });
  });
};