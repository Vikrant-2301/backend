const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');
const {
  findUserByEmail,
  editUserByEmail,
  findUserById,
  createUser,
  getAllUsers,
  getUserByEmail,
  deleteUserById
} = require('../repo/authRepo');

const signup = async (userData) => {
  const { role, ...rest } = userData;

  if (role && !['admin', 'user'].includes(role)) {
    throw new Error('Invalid role specified');
  }

  const existingUser = await findUserByEmail(rest.email);
  if (existingUser) throw new Error('Email already in use');

  const hashedPassword = await bcrypt.hash(rest.password, 10);
  rest.password = hashedPassword;

  const user = await createUser({ ...rest, role: role || 'user' });

  return user;
};

const login = async ({ email, password }) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error('Invalid credentials');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error('Invalid credentials');

  const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, jwtSecret, { expiresIn: '3h' });
  return { token, email: user.email, role: user.role };
};

const fetchAllUsers = async () => {
  return getAllUsers();
};

const fetchUserByEmail = async (email) => {
  const user = await getUserByEmail(email);
  if (!user) throw new Error('User not found');
  return user;
};

const deleteUser = async (id) => {
  const user = await deleteUserById(id);
  if (!user) throw new Error('User not found');
  return user;
};

const editUserService = async (email, userData) => {
  console.log("🚀 ~ editUserService ~ email:", email);
  console.log("🚀 ~ editUserService ~ userData:", userData);

  const user = await findUserByEmail(email);
  if (!user) throw new Error('User not found');

  // If password is included in userData, hash it before update
  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, 10);
  }

  const newUser = await editUserByEmail(email, userData);
  return newUser;
};

/**
 * Update profile picture path for user by email
 * @param {string} email
 * @param {string} filePath - filename or filepath saved by multer
 * @returns updated user document
 */
const updateProfilePictureService = async (email, filePath) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error('User not found');

  // Save profile picture filename or path in the profilePic field (consistent with model)
  user.profilePic = filePath;
  await user.save();

  return user;
};

module.exports = {
  signup,
  login,
  fetchAllUsers,
  fetchUserByEmail,
  deleteUser,
  editUserService,
  updateProfilePictureService
};
