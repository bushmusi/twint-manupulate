const db = require("../models");
const Arsenal = db.arsenal;

exports.mapTweets = (req,res) => {
    return req;
    const o = {};
    // `map()` and `reduce()` are run on the MongoDB server, not Node.js,
    // these functions are converted to strings
    o.map = function () { emit(this.name, 1) };
    o.reduce = function (k, vals) { return vals.length };
    let arr = [];
    Arsenal.mapReduce(o, function (err, results) {
        if(results.name === "bushra")
            arr.push(results);
    })

}