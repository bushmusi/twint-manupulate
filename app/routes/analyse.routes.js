const express = require('express');
const { model } = require('mongoose');
const modelCont = require('../controllers/analyse.controller')

const router = express.Router();

router.get('/multi-param-search',modelCont.dbGetTable)
router.get('/map-reduce',modelCont.mapReduceTable)
router.get('/twint-filter',modelCont.twintFilter)
router.get('/db-meta-data',modelCont.dbMetadata)

module.exports = router