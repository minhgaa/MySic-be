const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

router.get('/', verifyToken, isAdmin, userController.getUsers)
      .put('/:id', verifyToken, isAdmin, userController.updateUser)
      .delete('/:id', verifyToken, isAdmin, userController.deleteUser);

module.exports = router;
