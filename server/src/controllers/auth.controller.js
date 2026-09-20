import AuthService from '../services/auth.service.js';
import User from '../models/User.js';
import { authCookieOptions } from '../utils/cookie.js';

const authService = new AuthService(User);

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  username: user.username,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  bio: user.bio,
  bestWpm: user.bestWpm,
  averageWpm: user.averageWpm,
  accuracy: user.accuracy,
  testsCompleted: user.testsCompleted,
  totalTypingTime: user.totalTypingTime,
  currentStreak: user.currentStreak,
  createdAt: user.createdAt,
});

export const registerUser = async (req, res, next) => {
  try {
    const {user,token} = await authService.registerUser(req.body);

    res.cookie(
  'accessToken',
  token,
  authCookieOptions
);

    return res.status(201).json({
      success: true,
      user: formatUser(user),
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    const { user, token } = await authService.loginUser( identifier, password);

res.cookie(
  'accessToken',
  token,
  authCookieOptions
);
    return res.status(200).json({
      success: true,
      user: formatUser(user),
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.user._id);

    return res.status(200).json({
      success: true,
      user: formatUser(user),
    });
  } catch (error) {
    next(error);
  }
};


export const changePassword = async (req, res, next) => {
  console.log('BODY:', req.body);
  console.log('USER:', req.user);
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    await authService.changePassword(
      req.user._id,
      currentPassword,
      newPassword
    );

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// logout 

export const logoutUser = async (req, res, next) => {
  try {
    await authService.logoutUser();

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite:
        process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};