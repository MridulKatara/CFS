import type { Context } from 'elysia';
import User from '../models/User';
import MyProgram from '../models/MyProgram';

export const getProfile = async (ctx: any) => {
  try {
    const { user } = ctx;
    const profile = await User.findById(user._id).select('-password');
    if (!profile) {
      throw new Error('User not found');
    }
    return {
      success: true,
      user: profile
    };
  } catch (error: any) {
    throw new Error(error.message || 'Error fetching profile');
  }
};

export const updateProfile = async (ctx: any) => {
  try {
    const { user, body } = ctx;
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { fullName: (body as any).fullName },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return {
      success: true,
      user: updatedUser
    };
  } catch (error: any) {
    throw new Error(error.message || 'Error updating profile');
  }
};

export const updatePassword = async (ctx: any) => {
  try {
    const { user, body } = ctx;
    const isMatch = await user.comparePassword((body as any).currentPassword);
    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }

    user.password = (body as any).newPassword;
    await user.save();

    return {
      success: true,
      message: 'Password updated successfully'
    };
  } catch (error: any) {
    throw new Error(error.message || 'Error updating password');
  }
};

export const getMyPrograms = async (ctx: any) => {
  try {
    const { user } = ctx;
    const myPrograms = await MyProgram.find({ userId: user._id }).lean();
    return {
      success: true,
      myPrograms
    };
  } catch (error: any) {
    throw new Error(error.message || 'Error fetching my programs');
  }
};
