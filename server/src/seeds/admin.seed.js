import User from '../models/User.js';
import { hashPassword } from '../utils/password.js';

const createAdmin = async () => {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const username = process.env.ADMIN_USERNAME?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !username || !password) {
    throw new Error(
      'ADMIN_EMAIL, ADMIN_USERNAME and ADMIN_PASSWORD are required'
    );
  }

  // Check if admin already exists
  const existingAdmin = await User.findOne({
    role: 'admin',
  });

  if (existingAdmin) {
    console.log(
      `Admin Seed - Admin already exists: ${existingAdmin.email}`
    );
    return existingAdmin;
  }

  // Prevent conflict with existing normal user
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new Error(
      'Admin email or username already belongs to another user'
    );
  }

  const hashedPassword = await hashPassword(password);

  const admin = await User.create({
    name: process.env.ADMIN_NAME || 'System Admin',
    username,
    email,
    password: hashedPassword,
    role: 'admin',
    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
  });

  console.log(
    `Admin Seed - Admin created: ${admin.email}`
  );

  return admin;
};

export default createAdmin;