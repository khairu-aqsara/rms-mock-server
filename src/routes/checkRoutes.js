const express = require('express');
const router = express.Router();
const { checkDbConnection } = require('../controllers/checkController');

router.get('/db/connection', checkDbConnection);

module.exports = router;
