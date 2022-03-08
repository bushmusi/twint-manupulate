const { emit } = require('nodemon');
const db = require('../models');

var MongoClient = require('mongodb').MongoClient;  
var url = "mongodb://localhost:27017/"; 

exports.dbGetTable = (req,res) => {

    let res_list = [];

    MongoClient.connect(url, (err, client) => {

        if(err) throw err;

        let database = client.db('test');
        const [table_name,params] = [req.body.table_name,req.body.params]
        let queryParam = {}
        for (const [key,value] of Object.entries(params)){
            queryParam[key] =  value

        }
        
        database.collection(table_name).find(
            queryParam
            ).toArray((err,results) => {

            if(err) throw err;

            results.forEach( element => {
                let obj = {}
                obj.user_id = element.user_id
                obj.name = element.name
                obj.username = element.username
                res_list.push(obj);
            });

            res.send({
                "Query Data": res_list
            })

        })
    })
    
}

exports.mapReduceTable = (req,res) => {

    MongoClient.connect(url, (err, client) => {

        if(err) throw err;

        let database = client.db('twint');
        let table_name = req.body.table_name;
        const query = req.body.query;
        const map = emit(this.username,this.likes_count);

        database.collection(table_name).mapReduce(
            function() {
                emit(this.username, this.likes_count)
            },
            function(k,v) {
                return Array.sum(v);
            },
            { 
                query: {
                    likes_count: {$gt: 500}
                },
                out: {inline: 1}
            },
            function(err,result) {
                if(result) {
                    res.send({
                        result
                    })
                }
            }
        );
    })
}


exports.twintFilter = (req,res) => { 
    let res_list = []
    MongoClient.connect(url,(err,client) => {

        if(err) throw err;
        const db_name = req.body.db_name
        let database = client.db(db_name);
        let table_name = req.body.table_name;
        console.log(table_name);

        database.collection(table_name).find({
            hashtags: {$in: ['arsenal']}
        }).toArray(function(err,result){
            if(err) throw err;
            result.forEach((value,index) => {
                let tweeItem = {
                    _id: value._id,
                    user_id: value.user_id,
                    username: value.username,
                    name: value.name,
                    tweet: value.tweet,
                    likes_count: value.likes_count,
                    hashtags: value.hashtags
                }
                res_list.push(tweeItem)

            })
            
            res.send({
                "data" : res_list
            })
        })
    })
}

exports.dbMetadata = (req,res) => {
    let db_name = req.body.db_name
    MongoClient.connect(url,(err,client) =>{

        if(err) throw err;

        let database = client.db(db_name);
        database.listCollections().toArray(async (info,name_list) => {


            const str_list_new = name_list.map(async (val) => {

                const coll_name = val.name;

                const res_obj = {
                    name: coll_name,
                    type: val.type,
                    count: 0
                };

                count =database.collection(coll_name).estimatedDocumentCount();
                console.log(await count.then((res) => res));
                res_obj.count = await count.then((res) => res);
                console.log(res_obj);
                return res_obj
            });
            console.log(await str_list_new[0].then((res) => {return res}));
            
            res.send({
                "db-name" : db_name,
                "number of collection": str_list_new.length,
                "collection list: ": str_list_new
            })
        })
    })
}