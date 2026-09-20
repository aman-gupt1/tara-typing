import { hashPassword, verifyPassword } from "../utils/password.js";
import generateToken from "../utils/generateToken.js";

class AuthService {
  constructor(User) {
    this.User = User;
  }

  async registerUser({ name, username, email, password }) {
    const normalizedEmail = email.toLowerCase();
    const normalizedUsername = username.toLowerCase();

    const existingUser = await this.User.findOne({
      $or: [
        { email: normalizedEmail },
        { username: normalizedUsername },
      ],
    });


// check existance  of user
    if (existingUser) {
      const error = new Error(
        'User with this email or username already exists'
      );

      error.statusCode = 409;
      throw error;
    }

    // hashed password
    const hashedPassword = await hashPassword(password);
    const user = await this.User.create({
      name,
      username: normalizedUsername,
      email: normalizedEmail,
      password:hashedPassword,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${normalizedUsername}`,
    });
    const token = await generateToken(user);
    return {
      user,
      token
    };
  }

  async loginUser(identifier, password) {
    const normalizedIdentifier = identifier.toLowerCase();

    const user = await this.User.findOne({
      $or: [
        { email: normalizedIdentifier },
        { username: normalizedIdentifier },
      ],
    }).select('+password');

       if (!user) {
      const error = new Error(
        'Invalid email/username or password'
      );
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await verifyPassword(
  user.password,
  password
);

if (!isPasswordValid) {
  throw new Error('Invalid credentials');
}

 
    const token = generateToken(user);
    return {
      user, 
      token
    };
  }

  async getUserById(userId) {
    const user = await this.User.findById(userId);

    if (!user) {
      const error = new Error('User not found');

      error.statusCode = 404;
      throw error;
    }

    return user;
  }


async changePassword(userId, currentPassword, newPassword) {
  const user = await this.User.findById(userId).select('+password');

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const isCurrentPasswordValid = await verifyPassword(
    user.password,
    currentPassword
  );

  if (!isCurrentPasswordValid) {
    const error = new Error('Current password is incorrect');
    error.statusCode = 401;
    throw error;
  }

  const isSamePassword = await verifyPassword(
    user.password,
    newPassword
  );

  if (isSamePassword) {
    const error = new Error(
      'New password must be different from current password'
    );
    error.statusCode = 400;
    throw error;
  }

  user.password = await hashPassword(newPassword);

  await user.save();

  return true;
}

async logoutUser() {
  return true;
}

}

export default AuthService;