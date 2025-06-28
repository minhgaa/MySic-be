const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

router.get('/', verifyToken, isAdmin, userController.getUsers)
      // .put('/:id', verifyToken, isAdmin, userController.updateUser)
      .delete('/:id', verifyToken, isAdmin, userController.deleteUser)
      .get('/by-id/:id', userController.getUserById)
      .put('/:id', verifyToken, userController.updateUser);

module.exports = router;
