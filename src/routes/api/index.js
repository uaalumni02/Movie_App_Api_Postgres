const express = require('express');
const router = express.Router();
const movieRoute = require('./movies')


router.use('/movie', movieRoute)

module.exports = router