const userService = require('../services/user.service');

const getUsers = async (req, res) => {
    try {
        const users = await userService.getUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const getUserById = async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: 'User ID is required' });
  
      const user = await userService.getUserById(id);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

const updateUser = async(req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        await userService.updateUser(id, data);
        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteUser = async(req, res) => {
    try {
      const { id } = req.params;
      await userService.deleteUser(id);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { getUserById, getUsers, updateUser, deleteUser }