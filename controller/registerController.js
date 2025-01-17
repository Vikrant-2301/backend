// controllers/registrationController.js
const registrationService = require('../service/registerService');

const register = async (req, res) => {
  const registrationData = req.body;
  console.log("================================");
  console.log(registrationData);
  console.log("++++++++++++++++++++++++++++++++");

  console.log("|||||||||||||||||||||||||||||||||")

  try {
    const user = await registrationService.registerUser(registrationData);
    console.log("User",user)

    res.status(201).json({ message: 'Registration successful', user });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  register
};
