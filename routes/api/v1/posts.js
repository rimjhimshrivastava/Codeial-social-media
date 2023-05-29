const express = require('express');
const router = express.Router();

const postApi = require("../../../controllers/api/posts_api");
router.get('/', postApi.index);

module.exports = router;