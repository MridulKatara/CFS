import React, { useState, useEffect } from 'react';
import AdminNavBar from './AdminNavBar';
import ApiService from '../services/api';
import LogoutModal from '../common/profile/LogoutModal';
import { FiLogOut, FiSave, FiUser, FiLock } from 'react-icons/fi';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    personalEmail: '',
    role: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await ApiService.getUserProfile();
        if (response.success) {
          setUser(response.user);
          setFormData({
            fullName: response.user.fullName || '',
            personalEmail: response.user.personalEmail || '',
            role: response.user.role || ''
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setUpdateError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateSuccess(false);
    setUpdateError('');

    try {
      setLoading(true);
      const response = await ApiService.updateUserProfile({
        fullName: formData.fullName
      });

      if (response.success) {
        setUser(prev => ({ ...prev, ...formData }));
        setUpdateSuccess(true);
        setEditMode(false);
      } else {
        setUpdateError('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setUpdateError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavBar />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Admin Profile</h1>

        {loading && !user ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#704ee7]"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6">
            {updateSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
                Profile updated successfully!
              </div>
            )}

            {updateError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {updateError}
              </div>
            )}

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <div className="bg-[#704ee7] rounded-full p-4 text-white mr-4">
                  <FiUser size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{user?.fullName}</h2>
                  <p className="text-gray-600">{user?.role}</p>
                </div>
              </div>
              
              <button 
                onClick={() => setShowLogoutModal(true)} 
                className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 flex items-center gap-2"
              >
                <FiLogOut className="w-5 h-5 text-red-500" />
                <span className="text-gray-700">Logout</span>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={!editMode}
                  className={`w-full p-2 border rounded ${
                    editMode ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="personalEmail"
                  value={formData.personalEmail}
                  disabled
                  className="w-full p-2 border rounded bg-gray-50 border-gray-200"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  disabled
                  className="w-full p-2 border rounded bg-gray-50 border-gray-200"
                />
              </div>

              <div className="flex gap-2">
                {!editMode ? (
                  <button
                    type="button"
                    onClick={() => setEditMode(true)}
                    className="bg-[#704ee7] hover:bg-[#5f39e4] text-white font-bold py-2 px-4 rounded flex items-center gap-2"
                  >
                    <FiUser />
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#704ee7] hover:bg-[#5f39e4] text-white font-bold py-2 px-4 rounded flex items-center gap-2"
                    >
                      <FiSave />
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditMode(false);
                        setFormData({
                          fullName: user?.fullName || '',
                          personalEmail: user?.personalEmail || '',
                          role: user?.role || ''
                        });
                      }}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
      {showLogoutModal && <LogoutModal onClose={() => setShowLogoutModal(false)} />}
    </div>
  );
};

export default Profile; 