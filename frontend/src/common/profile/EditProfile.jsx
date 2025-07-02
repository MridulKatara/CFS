import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import apiService from '../../services/api';

const EditProfile = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        universityName: '',
        course: '',
        branch: '',
        studentCode: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await apiService.getUserProfile();
                const user = response.user;
                setFormData({
                    name: user.fullName || '',
                    universityName: user.universityName || '',
                    course: user.program || '',
                    branch: user.branch || '',
                    studentCode: user.studentCode || '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } catch {
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            setError("Passwords don't match!");
            return;
        }
        try {
            setLoading(true);
            // Update name if changed
            await apiService.updateUserProfile({ fullName: formData.name });
            // Update password if provided
            if (formData.newPassword) {
                await apiService.updatePassword({ password: formData.newPassword });
            }
            setSuccess('Profile updated successfully!');
            setTimeout(() => navigate('/profile'), 1000);
        } catch {
            setError('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    if (loading) {
        return <div className="w-full min-h-screen flex items-center justify-center bg-[#f5f5f5]">Loading...</div>;
    }

    return (
        <div className="w-full min-h-screen bg-[#f5f5f5] p-4">
            {/* Header */}
            <div className="flex items-center mb-6">
                <FiArrowLeft className="w-6 h-6 mr-4 cursor-pointer" onClick={handleBackClick} />
                <h1 className="text-xl font-semibold flex-1 text-center mr-6">Edit Profile</h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 space-y-4">
                {/* Name - Editable */}
                <div>
                    <label className="text-sm text-[#555] mb-1 block">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-[#d9d9d9] p-3 text-[#212121]"
                        placeholder="Enter your name"
                    />
                </div>

                {/* University Name - Read Only */}
                <div>
                    <label className="text-sm text-[#555] mb-1 block">University Name</label>
                    <input
                        type="text"
                        name="universityName"
                        value={formData.universityName}
                        readOnly
                        className="w-full rounded-lg border border-[#d9d9d9] p-3 bg-[#fafafa] text-[#666]"
                        placeholder="Enter your university name"
                    />
                </div>

                {/* Course - Read Only */}
                <div>
                    <label className="text-sm text-[#555] mb-1 block">Course</label>
                    <input
                        type="text"
                        name="course"
                        value={formData.course}
                        readOnly
                        className="w-full rounded-lg border border-[#d9d9d9] p-3 bg-[#fafafa] text-[#666]"
                        placeholder="Enter your course"
                    />
                </div>

                {/* Branch - Read Only */}
                <div>
                    <label className="text-sm text-[#555] mb-1 block">Branch</label>
                    <input
                        type="text"
                        name="branch"
                        value={formData.branch}
                        readOnly
                        className="w-full rounded-lg border border-[#d9d9d9] p-3 bg-[#fafafa] text-[#666]"
                        placeholder="Enter your branch"
                    />
                </div>

                {/* Student Code - Read Only */}
                <div>
                    <label className="text-sm text-[#555] mb-1 block">Student Code</label>
                    <input
                        type="text"
                        name="studentCode"
                        value={formData.studentCode}
                        readOnly
                        className="w-full rounded-lg border border-[#d9d9d9] p-3 bg-[#fafafa] text-[#666]"
                        placeholder="Enter your Student code"
                    />
                </div>

                {/* Divider */}
                <div className="border-t border-[#d9d9d9] my-6" />

                {/* Change Password Section */}
                <div className="text-center mb-4">
                    <h3 className="text-base font-semibold text-[#111]">Change Password</h3>
                </div>

                {/* New Password */}
                <div>
                    <label className="text-sm text-[#555] mb-1 block">New Password</label>
                    <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-[#d9d9d9] p-3 text-[#212121]"
                        placeholder="Create new password"
                    />
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="text-sm text-[#555] mb-1 block">Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-[#d9d9d9] p-3 text-[#212121]"
                        placeholder="Confirm your password"
                    />
                </div>

                {error && <div className="text-red-500 text-center">{error}</div>}
                {success && <div className="text-green-600 text-center">{success}</div>}

                {/* Save Button */}
                <button
                    type="submit"
                    className="w-full mt-6 rounded-lg bg-[#704ee7] text-white py-3 font-semibold"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Save'}
                </button>
            </form>
        </div>
    );
};

export default EditProfile;
