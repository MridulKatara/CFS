import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit, FiArrowLeft, FiChevronRight, FiLogOut, FiUser } from 'react-icons/fi';
import LogoutModal from './LogoutModal';
import BottomNavBar from '../../student/ButtomNavItem';

const Profile = () => {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate();
    const [userData] = useState({
        name: "John Smith",
        email: "john@iitmandi.ac.in",
        studentCode: "S123456",
        university: "IIT Mandi",
        programs: [
            {
                name: "Computer Science",
                semester: 3,
                feesStatus: "Pending"
            },
            {
                name: "Business Analytics",
                semester: 3,
                feesStatus: "Paid"
            }
        ]
    });

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleEditClick = () => {
        navigate('/edit-profile');
    };

    const handlePaymentHistoryClick = () => {
        navigate('/payment');
    };

    return (
        <div className="w-full relative bg-[#f5f5f5] min-h-screen overflow-hidden pb-20 flex flex-col">
            <div className="mx-auto max-w-[375px] bg-white rounded-[32px] shadow-lg p-6 mt-4 flex-1 overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <FiArrowLeft className="w-6 h-6 cursor-pointer" onClick={handleBackClick} />
                    <div className="text-xl font-semibold flex-1 text-center">Profile</div>
                </div>
                <div className="flex justify-between items-center mb-8">
                    <FiEdit className="w-6 h-6 cursor-pointer" onClick={handleEditClick} />
                    <FiUser className="w-6 h-6" />
                    <FiLogOut className="w-6 h-6 cursor-pointer" onClick={() => setShowLogoutModal(true)} />
                </div>

                {/* Profile Info */}
                <div className="text-center mb-8">
                    <h2 className="text-xl font-semibold mb-1">{userData.name}</h2>
                    <p className="text-sm text-[#454545]">{userData.email}</p>
                </div>

                {/* Details */}
                <div className="text-center mb-6">
                    <div className="mb-4">
                        <p className="text-sm text-[#555]">Student Code</p>
                        <p className="text-base font-medium">{userData.studentCode}</p>
                    </div>
                    <div>
                        <p className="text-sm text-[#555]">University</p>
                        <p className="text-base font-medium">{userData.university}</p>
                    </div>
                </div>

                {/* Programs */}
                {userData.programs.map((program, index) => (
                    <div 
                        key={index} 
                        className="bg-white rounded-[20px] border border-[#e6e6e6] mb-4 p-4 text-center"
                    >
                        <div className="mb-4">
                            <p className="text-sm text-[#555]">Program Name</p>
                            <p className="text-base font-medium">{program.name}</p>
                        </div>
                        <div className="mb-4">
                            <p className="text-sm text-[#555]">Current Semester</p>
                            <p className="text-base font-medium">{program.semester}</p>
                        </div>
                        <div>
                            <p className="text-sm text-[#555]">Fees Status</p>
                            <p className={`text-base font-medium ${
                                program.feesStatus === 'Paid' 
                                    ? 'text-[#008000]' 
                                    : 'text-[#d48b06]'
                            }`}>
                                {program.feesStatus}
                            </p>
                        </div>
                    </div>
                ))}

                {/* Payment History */}
                <div className="flex justify-between items-center mt-6 px-2 cursor-pointer" onClick={handlePaymentHistoryClick}>
                    <span className="text-base font-medium">Payment History</span>
                    <FiChevronRight className="w-6 h-6" />
                </div>
            </div>

            {/* Logout Modal */}
            {showLogoutModal && <LogoutModal onClose={() => setShowLogoutModal(false)} />}
            
            <BottomNavBar />
        </div>
    );
};

export default Profile;
