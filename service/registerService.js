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

    const subject = "Payment Successful";
     
  

    email.forEach(e => {

      const body = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #4CAF50; text-align: center;">Registration Successful</h2>
      <p>Dear ${e},</p>
      <p>I am pleased to inform you that your registration for The Social Hub, the DiscoverArch competition, has been successfully processed.</p>
      <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 8px;">
        <h4 style="margin: 0 0 10px;">Team Identification Number:</h4>
      </div>
      <p>We have curated an exciting lineup of webinars and events to further enrich your architectural journey. Expect notifications soon with details on these insightful sessions.</p>
      <p>For more updates, follow our Instagram page: <a href="https://www.instagram.com/discoverarch" style="color: #4CAF50;">@discoverarch</a></p>
      <p>Best Regards,<br>Team DiscoverArch</p>
      <footer style="text-align: center; margin-top: 30px; font-size: 12px; color: #888;">
        <p>&copy; 2025 DiscoverArch. All rights reserved.</p>
      </footer>
    </div>`;

      sendMail(e, subject, body);
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


const getAllRegisteredData = async () => {
  try {
    const users = await RegisterModel.find();
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

module.exports = {
  registerUser,
  validateUserData,
  getAllRegisteredData
};
