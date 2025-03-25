const { userModel } = require('../db');
const jwt = require('jsonwebtoken');
 
async function registerController(req, res) {
  try {
    const { userName, password } = req.body;
    console.log('userName: ' + userName + ' Password: ' + password);

    // Create user and await the result
    const data = await userModel.create({
      username: userName,
      password: password,
    });

    console.log('Created user:', data);
    const id = data._id;
    const token = jwt.sign({ id }, 'bar', { expiresIn: 1 * 24 * 60 * 60 });

    // Send success response
    res.status(200).json({
      token: token,
      userId: id,
      message: 'Registered the user!',
    });
  } catch (err) {
    console.log('Error:', err);
    if (err.code === 11000) {
      return res.status(403).json({
        message: 'Account already registered, sign in',
      });
    }
    res.status(500).json({
      message: 'Server error during registration',
    });
  }
}

module.exports = {
  registerController,
};