module.exports = app => {
    const arsenal = require("../controllers/arsenal.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tweet
    router.post("/", arsenal.create);
  
    // Retrieve all arsenal
    router.get("/", arsenal.findAll);
  
    // Retrieve all published arsenal
    router.get("/published", arsenal.findAllPublished);
  
    // Retrieve a single Tweet with id
    router.get("/:id", arsenal.findOne);
  
    // Update a Tweet with id
    router.put("/:id", arsenal.update);
  
    // Delete a Tweet with id
    router.delete("/:id", arsenal.delete);
  
    // Create a new Tweet
    router.delete("/", arsenal.deleteAll);
  
    app.use('/api/arsenal', router);
  };