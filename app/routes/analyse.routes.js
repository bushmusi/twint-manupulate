
const analyse = require("../controllers/analyse.controller.js");
var router = global.router

router.get('/map',analyse.mapTweets);

module.exports = router

module.exports = app => {
    const arsenal = require("../controllers/analyse.controller");
  
    var router = require("express").Router();
  
    // Retrieve all arsenal
    router.get("/", arsenal.findAll);
  
    app.use('/api/arsenal', router);
  };
