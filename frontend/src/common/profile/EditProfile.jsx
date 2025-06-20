import React, { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import userData from '../../data/users.json';

const EditProfile = () => {
    const firstUser = userData[0];
    const [formData, setFormData] = useState({
        name: firstUser.fullName,
        universityName: firstUser.universityName,
        course: firstUser.program,
        branch: firstUser.branch,
        studentCode: firstUser.enrollmentId,
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Only allow name to be edited
        if (name === 'name') {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }
        console.log('Saving profile:', formData);
    };

    return (
        <div className="w-full min-h-screen bg-[#f5f5f5] p-4">
            {/* Header */}
            <div className="flex items-center mb-6">
                <FiArrowLeft className="w-6 h-6 mr-4" />
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
            </form>

            {/* Save Button */}
            <button
                onClick={handleSubmit}
                className="w-full mt-6 rounded-lg bg-[#704ee7] text-white py-3 font-semibold"
            >
                Save
            </button>
        </div>
    );
};

export default EditProfile;
