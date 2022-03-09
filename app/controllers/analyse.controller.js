const { emit } = require('nodemon');
const { MongoClient } = require('mongodb');
const db = require('../models/index.js');

const url = 'mongodb://localhost:27017/';

exports.dbGetTable = (req, res) => {
  const resList = [];

  MongoClient.connect(url, (err, client) => {
    if (err) throw err;

    const database = client.db(req.body.dbName);
    // const [tableName, params] = [req.body.tableName, req.body.params];
    const { tableName, params } = req.body;

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

    const { tableName, dbName } = req.body;
    const database = client.db(dbName);

    database.collection(tableName).mapReduce(/* eslint-disable */
      function () { /* eslint-disable */
        emit(this.username, this.likes_count);
      },
      function (k, v) {
        return Array.sum(v)
      },
      {
        query: {
          $and:
          [
            {likes_count: { $gt: 500 }},
            {date: '2021-12-31'}
          ]
        },
        out: { inline: 1 },
      },
      (err, result) => {
        result ? res.send(result) : err
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
      result.forEach((value, index) => {
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
        resObj.count = await count.then((res) => res);
        return resObj;
      });

      res.send({
        'db-name': dbName,
        'number of collection': strListNew.length,
        'collection list: ': strListNew,
      });
    });
  });
};