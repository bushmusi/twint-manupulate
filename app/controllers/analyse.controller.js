const { emit } = require('nodemon');
const db = require('../models');

var MongoClient = require('mongodb').MongoClient;  
var url = "mongodb://localhost:27017/test"; 

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

        let database = client.db('test');
        let table_name = req.body.table_name;

        database.collection(table_name).mapReduce(
            function () {
                emit(1,this.username)
            },
            function(k,v) {
                var result = {};
                result.username = v;
                return result
            },
            { out: {inline: 1}},
            function(err,result) {
                if(result) {
                    res.send({
                        'result': result[0].value
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
        let database = client.db('test');
        let table_name = req.body.table_name;
        database.collection(table_name).find({
            likes_count: {$gt: 200}
        }).toArray(function(err,result){
            if(err) throw err;
            result.forEach((value,index) => {
                let tweeItem = {
                    _id: value._id,
                    user_id: value.user_id,
                    username: value.username,
                    name: value.name,
                    tweet: value.tweet,
                    likes_count: value.likes_count
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
        database.listCollections().toArray((info,name_list) => {
            const str_list_new = name_list.map((val,index,arrName) => {
                const coll_name = val.name;
                let res_obj = {
                    name: coll_name,
                    type: val.type,
                    count: ''
                }
                const num_doc = database.collection(coll_name).countDocuments().then((count)=>{
                    console.log("collection:",coll_name,"count:", count);
                    res_obj.count = count
                })
                return res_obj
            });
            res.send({
                "db-name" : db_name,
                "number of collection": str_list_new.length,
                "collection list: ": str_list_new
            })
        })
    })
}