import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutModal from './LogoutModal';
import BottomNavBar from '../../student/ButtomNavItem';
import apiService from '../../services/api';
import { FiEdit, FiLogOut } from 'react-icons/fi';
import { FaUserTie } from "react-icons/fa";

const Profile = () => {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [userData, setUserData] = useState(null);
    const [enrolledPrograms, setEnrolledPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await apiService.getUserProfile();
                setUserData(response.user);
                // Fetch enrolled programs if available
                const progRes = await apiService.getMyPrograms();
                setEnrolledPrograms(progRes.data || []);
            } catch {
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleEditClick = () => {
        navigate('/edit-profile');
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-[#f5f5f5]">
                <div className="text-lg text-gray-600">Loading profile...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-[#f5f5f5]">
                <div className="text-lg text-red-600">{error}</div>
            </div>
        );
    }

    if (!userData) {
        return null;
    }

    return (
        <div className="w-full min-h-screen bg-[#f5f5f5] flex flex-col pb-20">
            <div className="mx-auto w-full max-w-[375px] md:max-w-[600px] lg:max-w-[800px] px-2 md:px-4 lg:px-6 pt-6">
                {/* Card-like container - responsive */}
                <div className="relative [backdrop-filter:blur(34px)] rounded-3xl bg-white flex flex-col items-center justify-start pt-6 px-4 md:px-6 lg:px-8 pb-2 box-border gap-3 shadow-lg">
                    {/* Edit and Logout in top corners */}
                    <div className="absolute top-4 left-4">
                        <button onClick={handleEditClick} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200">
                            <FiEdit className="w-5 h-5 text-gray-700" />
                        </button>
                    </div>
                    <div className="absolute top-4 right-4">
                        <button onClick={() => setShowLogoutModal(true)} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200">
                            <FiLogOut className="w-5 h-5 text-red-500" />
                        </button>
                    </div>
                    {/* Avatar - fallback to FaUserTie if no image */}
                    {userData.profileImage ? (
                        <img 
                            className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full object-cover border-4 border-white shadow-md mb-2" 
                            alt="avatar" 
                            src={userData.profileImage} 
                        />
                    ) : (
                        <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-md mb-2">
                            <FaUserTie className="w-12 h-12 text-gray-400" />
                        </div>
                    )}
                    {/* Name & Email - responsive text */}
                    <div className="flex flex-col items-center justify-start gap-2 mb-2">
                        <div className="text-xl md:text-2xl lg:text-3xl font-semibold leading-[120%] text-center">{userData.fullName}</div>
                        <div className="text-xs md:text-sm lg:text-base font-poppins text-gray-500 leading-[120%] text-center">{userData.personalEmail}</div>
                    </div>
                    {/* Details - responsive grid layout */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-xs md:text-sm text-dimgray font-inter mb-2">
                        <div className="flex flex-col items-start justify-start gap-0.5">
                            <div className="leading-[120%]">Student Code</div>
                            <div className="w-full text-sm md:text-base leading-[140%] font-medium font-poppins text-gray-700">{userData.studentCode || '-'}</div>
                        </div>
                        <div className="flex flex-col items-start justify-start gap-0.5">
                            <div className="leading-[120%]">University</div>
                            <div className="w-full text-sm md:text-base leading-[140%] font-medium font-poppins text-gray-700">{userData.universityName}</div>
                        </div>
                    </div>
                    {/* My Community Card */}
                    <div className="w-full flex flex-row items-center justify-between bg-[#fff7f3] rounded-xl px-4 py-3 mb-3">
                        <span className="font-medium text-base">My Community</span>
                        <span className="bg-[#fa5620] text-white text-xs font-semibold rounded-xl px-3 py-1">Coming Soon</span>
                    </div>
                    {/* Enrolled Programs */}
                    {enrolledPrograms.length > 0 && (
                        enrolledPrograms.map((program, idx) => (
                            <div key={program._id || idx} className="w-full bg-white rounded-2xl border border-gray-200 p-4 mb-3 flex flex-col gap-2 shadow-sm">
                                <div className="text-xs text-gray-500">Program Name</div>
                                <div className="text-base font-semibold text-gray-900">{program.programName}</div>
                                <div className="flex flex-row justify-between mt-2">
                                    <div>
                                        <div className="text-xs text-gray-500">Current Semester</div>
                                        <div className="text-sm font-medium text-gray-800">{program.currentSemester || '-'}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500">Fees Status</div>
                                        <div className={`text-sm font-medium ${program.paymentStatus === 'Completed' ? 'text-green-600' : 'text-yellow-600'}`}>{program.paymentStatus || '-'}</div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            {showLogoutModal && <LogoutModal onClose={() => setShowLogoutModal(false)} />}
            <BottomNavBar />
        </div>
    );
};

export default Profile;
