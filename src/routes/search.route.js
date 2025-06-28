const express = require("express");
const router = express.Router();
const SearchController = require("../controllers/search.controller");

router.get("/search", SearchController.search);

module.exports = router;
