import User from '../models/User';

export const getAllUsers = async () => {
  try {
    const users = await User.find({})
      .select('-password')
      .lean();
    
    return {
      success: true,
      users
    };
  } catch (error: any) {
    throw new Error(error.message || 'Error fetching users');
  }
};
