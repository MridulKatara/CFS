import React from 'react';
import { FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { logout } from '../auth';

const LogoutModal = ({ onClose }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="fixed inset-0 bg-[#000]/50 flex items-center justify-center z-50">
            <div className="w-full max-w-md relative rounded-3xl bg-[#fff] flex flex-col items-center justify-start p-8 box-border gap-12">
                <h2 className="text-lg font-semibold text-[#222]">
                    Are you sure you want to logout?
                </h2>
                
                <div className="flex w-full gap-6">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-lg bg-[#f0edfd] text-[#603ae5] py-2.5 px-5 font-semibold"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex-1 rounded-lg text-[#ea1105] py-2.5 px-5 font-semibold"
                    >
                        Logout
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-[10px] right-[10px] w-6 h-6 cursor-pointer"
                >
                    <FiX className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default LogoutModal;
