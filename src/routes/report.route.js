const express = require("express");
const router = express.Router();
const ReportController = require("../controllers/report.controller");
const { verifyToken, isAdmin } = require("../middlewares/auth.middleware");
const { validationResult } = require('express-validator');
const validator = require('../validators/report.validator');
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};


router.get('/', verifyToken, isAdmin, ReportController.getReports)
      .delete('/:id', verifyToken, isAdmin, ReportController.deleteReport);

router.post('/', verifyToken, validator.reportValidator, validate, ReportController.createReport);

module.exports = router;
