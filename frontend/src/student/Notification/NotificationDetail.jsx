import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import notifications from '../../data/notifications.json';

const NotificationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const notification = notifications.find(n => n.id === id);

    if (!notification) {
        return <div>Notification not found</div>;
    }

    return (
        <div className="w-full min-h-screen bg-[#f5f5f5]">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 px-4 py-5 flex items-center">
                <button 
                    onClick={() => navigate(-1)}
                    className="w-8 h-8 flex items-center justify-center"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="#202124"/>
                    </svg>
                </button>
                <h1 className="text-[#202124] text-2xl font-semibold flex-1 text-center">Notifications</h1>
                <div className="w-8 h-8"></div>
            </div>

            {/* Notification Detail */}
            <div className="p-4">
                <div className="bg-white rounded-2xl p-4">
                    <h2 className="text-base font-medium text-[#202124] mb-2">
                        {notification.title}
                    </h2>
                    <p className="text-xs leading-[140%] text-[#454545] whitespace-pre-wrap">
                        {notification.message}
                    </p>
                    
                    {notification.details && (
                        <div className="mt-4 space-y-2 border-t border-[#f5f5f5] pt-4">
                            {Object.entries(notification.details).map(([key, value]) => (
                                <div key={key} className="text-xs flex">
                                    <span className="font-medium text-[#202124] capitalize w-1/3">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}: 
                                    </span>
                                    <span className="text-[#454545] flex-1">
                                        {Array.isArray(value) ? value.join(', ') : value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Bar */}
            <nav className="fixed bottom-0 w-full bg-white border-t border-[#f5f5f5]">
                <div className="h-6 bg-white flex justify-center items-center">
                    <div className="w-[108px] h-1 bg-[#1d1b20] rounded-xl"></div>
                </div>
                <div className="flex justify-between px-2 py-2">
                    <NavItem icon="home" label="Home" />
                    <NavItem icon="book" label="My Program" />
                    <NavItem icon="notifications" label="Notification" active />
                    <NavItem icon="profile" label="Profile" />
                </div>
            </nav>
        </div>
    );
};

const NavItem = ({ label, active }) => (
    <div className={`flex flex-col items-center gap-1 flex-1 ${
        active ? 'text-[#704ee7]' : 'text-[#757575]'
    }`}>
        <div className="w-8 h-8 flex items-center justify-center">
            {/* Add your icon component/image here */}
        </div>
        <span className="text-xs font-medium">{label}</span>
    </div>
);

export default NotificationDetail;
