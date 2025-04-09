const UserService = require("../services/userService");

class UserController {
  static async registerUser(req, res) {
    try {
      const { phone, firstName, lastName, password } = req.body;
      const user = await UserService.registerUser(
        phone,
        firstName,
        lastName,
        password
      );
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async loginUser(req, res) {
    try {
      const { phone, password } = req.body;
      const user = await UserService.loginUser(phone, password);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async searchUserByPhone(req, res) {
    try {
      const user = await UserService.searchUserByPhone(req.params.phone);
      res.json(user);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  static async updateUser(req, res) {
    try {
      const user = await UserService.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  static async getUserProfile(req, res) {
    try {
      const user = await UserService.getUserProfile(req.params.id);
      res.json(user);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

module.exports = UserController;
