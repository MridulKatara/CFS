import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import notifications from '../../data/notifications.json';
import forms from '../../data/forms.json';
import { HomeIcon, BookIcon, NotificationIcon, ProfileIcon } from '../../common/compnent/Icons';

const Notification = () => {
    const navigate = useNavigate();

    // Combine notifications and forms data
    const allNotifications = [
        ...notifications.map(notif => ({
            ...notif,
            type: 'notification'
        })),
        ...forms.forms.map(form => ({
            id: form.id,
            type: 'form',
            title: form.title,
            message: form.description,
            status: form.status,
            submittedOn: form.submittedOn,
            deadline: form.deadline
        }))
    ].sort((a, b) => new Date(b.timestamp || b.deadline) - new Date(a.timestamp || a.deadline));

    const handleNotificationClick = (item) => {
        if (item.type === 'notification') {
            navigate(`/notification/${item.id}`);
        }
    };

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

            {/* Notifications List */}
            <div className="px-4 py-6 space-y-3">
                {allNotifications.map((item) => (
                    <div 
                        key={`${item.type}-${item.id}`}
                        onClick={() => handleNotificationClick(item)}
                        className={`rounded-2xl bg-white p-4 shadow-sm ${
                            item.type === 'notification' && !item.isRead 
                                ? 'border-l-[3px] border-[#704ee7]' 
                                : item.type === 'form' ? 'bg-[rgba(255,255,255,0.8)]' : ''
                        }`}
                    >
                        <div className="space-y-2">
                            <h3 className="text-base font-medium text-[#202124]">
                                {item.title}
                            </h3>
                            <p className="text-xs text-[#454545]">
                                {item.message}
                            </p>
                            {item.type === 'form' && (
                                <div className="flex items-center gap-3 mt-3">
                                    <span className="text-xs text-[#454545]">
                                        {item.status === 'completed' 
                                            ? `Submitted on - ${new Date(item.submittedOn).toLocaleDateString('en-US', { 
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                              })}` 
                                            : `Deadline - ${new Date(item.deadline).toLocaleDateString('en-US', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                              })}`
                                        }
                                    </span>
                                    {item.status === 'completed' && (
                                        <span className="px-2 py-0.5 text-xs font-semibold text-[#0cc85c] border border-[#0cc85c] rounded-lg">
                                            Completed
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
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

const NavItem = ({ icon, label, active }) => {
    const getIcon = () => {
        switch (icon) {
            case 'home':
                return <HomeIcon active={active} />;
            case 'book':
                return <BookIcon active={active} />;
            case 'notifications':
                return <NotificationIcon active={active} />;
            case 'profile':
                return <ProfileIcon active={active} />;
            default:
                return null;
        }
    };

    return (
        <Link 
            to={`/${icon === 'home' ? '' : icon}`}
            className={`flex flex-col items-center gap-1 flex-1 ${
                active ? 'text-[#704ee7]' : 'text-[#757575]'
            }`}
        >
            <div className="w-8 h-8 flex items-center justify-center">
                {getIcon()}
            </div>
            <span className="text-xs font-medium">{label}</span>
        </Link>
    );
};

export default Notification;
