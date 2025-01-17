// services/registrationService.js
const RegisterModel = require('../model/registerModel');
const { sendMail } = require('../utils/mail.util');
const registerUser = async (data) => {
  try {
    
    const user = new RegisterModel(data);
    await user.save();
    console.log(user);
    const jsonUserData = user.toJSON();
    var email = []
    if (jsonUserData.registrationType === 'individual'){
      email.push(jsonUserData.email);
    }else{
      email = jsonUserData.teamMembers.map(member => member.email);
    }
    console.log('email',email)
    email.forEach(e => {
      sendMail(e, "Payment Successful", "Payment Done.");
    });
    

    return user;
  } catch (error) {
    console.error("Error saving user:", error);
    throw error;
  }
};


const validateUserData = (data) => {
  // Add validation logic (like email format, phone number, etc.)
  const errors = [];
  if (!data.fullName || data.fullName.length < 3) {
    errors.push("Full name must be at least 3 characters");
  }
  if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
    errors.push("Invalid email address");
  }
  if (data.phoneNumber && !/^\d{10}$/.test(data.phoneNumber)) {
    errors.push("Invalid phone number");
  }
  if (data.registrationType === "team") {
    // Validate team members
    data.teamMembers.forEach((member, idx) => {
      if (!member.fullName || !member.email || !member.phoneNumber) {
        errors.push(`Team member ${idx + 1} is missing information`);
      }
    });
  }
  return errors;
};

module.exports = {
  registerUser,
  validateUserData
};
