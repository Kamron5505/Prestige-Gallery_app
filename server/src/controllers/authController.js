import User from '../models/User.js';
import { generateTokens } from '../middleware/auth.js';
import jwt from 'jsonwebtoken';
import { AppError } from '../middleware/errorHandler.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.validatedBody;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already registered.', 409);
    }

    const user = await User.create({ name, email, password, phone });
    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      data: {
        user,
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.validatedBody;

    const user = await User.findOne({ email }).select('+password +refreshToken');
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password.', 401);
    }

    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      data: {
        user,
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      throw new AppError('Refresh token not found.', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId).select('+refreshToken');

    if (!user || user.refreshToken !== token) {
      throw new AppError('Invalid refresh token.', 401);
    }

    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      const user = await User.findOne({ refreshToken: token });
      if (user) {
        user.refreshToken = null;
        await user.save({ validateBeforeSave: false });
      }
    }

    res.clearCookie('refreshToken');
    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res) => {
  res.json({
    success: true,
    data: { user: req.user },
  });
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone },
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

export const addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const address = req.body;

    if (address.isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
    }

    user.addresses.push(address);
    await user.save();

    res.status(201).json({ success: true, data: { addresses: user.addresses } });
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter((a) => a._id.toString() !== req.params.id);
    await user.save();
    res.json({ success: true, data: { addresses: user.addresses } });
  } catch (error) {
    next(error);
  }
};
